(module
    (import "env" "mem" (memory 1))
    (import "env" "print" (func $print (param i32)))
    ;; Static Globals
    ;; Memory Structure
    ;;(width 4 bytes)(height 4 bytes)(error parameters 20 bytes) = 28 bytes
    ;;(colour pallet 20 bytes) = 28 + 20 = 48 bytes
    ;;(complexity 4 bytes)(colourmode 4 bytes)(debugMode 4 bytes) = 48 + 12 = 60 bytes (round to 100 room for future data)
    ;; 100 - 68 bytes = 32 "free bytes"
    ;; total entropy 1300 bytes
      ;;(sig public message - 100 -> 165) use the sigMessage as the first 65 bytes of entropy  
      ;;(generated entropy) = 165 -> 1400) = 1235 (1300 total bytes of entropy including the original key)  
        ;; public key of generator (20 bytes)
        ;; messageSig of generation (65 bytes)
        ;; 20*65=1300

    (global $g_WIDTH_INDEX i32 (i32.const 0)) ;; current location of the i32 val that makes up the entrophy
    (global $g_HEIGHT_INDEX i32 (i32.const 4)) ;; current location of the i32 val that makes up the entrophy
    (global $g_ERROR_PARAMETER_START_INDEX i32 (i32.const 8)) ;; current location of the i32 val that makes up the entrophy   
    (global $g_PALLET_START_INDEX i32 (i32.const 28)) ;; current location of the i32 val that makes up the entrophy
    (global $g_COMPLEXITY_INDEX i32 (i32.const 48)) ;; current location of the i32 val that makes up the entrophy
    (global $g_COLOURMODE_INDEX i32 (i32.const 49)) ;; current location of the i32 val that makes up the entrophy
    (global $g_DEBUGMODE_INDEX i32 (i32.const 50)) ;; current location of the i32 val that makes up the entrophy
    (global $g_BYTES_OF_ENTROPY i32 (i32.const 1235)) ;; current location of the i32 val that makes up the entrophy
    (global $g_PALLET_COLOUR_COUNT i32 (i32.const 5)) ;; current location of the i32 val that makes up the entrophy
    (global $g_OPACITY_ADJUSTMENT i32 (i32.const 25)) ;; current location of the i32 val that makes up the entrophy

    ;; this is the part of mem reserved for properties, entropy, error messages
    (global $g_RESERVED_MEM_END_INDEX i32 (i32.const 3000)) ;; current location of the i32 val that makes up the entrophy

    (global $g_VERSIONSIG_START i32 (i32.const 65)) ;; memory start of signed message that acts as a verion identifier for this GA
            (data (i32.const 65) "\c9\b7\2d\ac\0c\47\81\1d\9c\d2\33\cb\f3\5e\83\a1\f4\32\1d\9a\45\44\94\36\cc\55\58\65\42\50\ff\c1\0b\86\46\3a\32\b6\d1\98\c8\d1\f6\ea\91\cf\b2\a7\34\82\42\a8\bb\62\21\98\2f\8d\fb\6e\f0\8c\db\fe\1c")
    (global $g_VERSIOSIG_LENGTH i32 (i32.const 65)) ;; how many bytes is the signed message, will have to ignore the first 2 characters
    (global $g_CURRENT_VERSIONSIG_INDEX (mut i32)(i32.const 65))
    (global $g_CURRENT_ENTROPY_MEMORY_INDEX (mut i32)(i32.const 130)) ;; current location of the i32 val that makes up the entrophy
    (global $g_CURRENT_COLOUR_INDEX (mut i32)(i32.const 0)) ;; current location of the i32 val that makes up the entrophy
    (global $g_CURRENT_PUBLIC_KEY_INDEX (mut i32)(i32.const 28)) ;; current location of the i32 val that makes up the entrophy
    (global $g_BACKGROUND_COLOUR (mut i32) (i32.const 0)) ;; used to set the background colour
    
    ;; Error Handling
    (data (i32.const 1400) "\3C\05$properties (width,height,complexity,bgcolour,colour mode): ")
    (data (i32.const 1462) "\20\03$getRangedRando (low,rand,max): ")
    (data (i32.const 1496) "\34\02$getNextEntropy (bytes,currentEntropyIndex,result): ")
    (data (i32.const 1550) "\2A\02$getColourByIndex (index,returnedColour): ")
    (data (i32.const 1594) "\33\02$getNextColourSequentially (index,returnedColour): ")
    (data (i32.const 1647) "\23\01$getRandomColour (returnedColour): ")
    (data (i32.const 1684) "\33\05$increaseTransparency (x,y,blendingMode,%,colour): ")
    (data (i32.const 1737) "\25\03$averageBit (existing,replaced,new): ")
    (data (i32.const 1776) "\2C\05$increaseOpacity (x,y,blendingMode,colour): ")
    (data (i32.const 1822) "\1F\03$overwriteColour (x,y,colour): ")
    (data (i32.const 1855) "\1A\01$drawBackground (colour): ")
    (data (i32.const 1883) "\2D\04$drawPixel (x,y,proposedColour,finalColour): ")
    (data (i32.const 1930) "\3E\02$getNextPublicKeyByte (currentPub,endMemLocation,returnedPK): ")
    (data (i32.const 1994) "\31\02$getNextVersionSigByte (currentSig,returnedVal): ")
    (data (i32.const 2045) "\18\04$initEntropy (entropy): ")
    (data (i32.const 2071) "\2D\05$drawCentrePointRect (x,y,1/2w,1/2h,colour): ")
    (data (i32.const 2118) "\28\04$setColourAtLocation (x,y,memLoc,colour)")
    (data (i32.const 2160) "\43\03$changeTransparency (startingColour, adjustmentAmount,endingColour)")
    (data (i32.const 2229) "\17\04$plotLine (x0,x1,dY,dX)")
    (data (i32.const 2254) "\1E\05LLL-$plotLineLow (x0,y0,x1,y1)")
    (data (i32.const 2286) "\1F\05HHH-$plotLineHigh (x0,y0,x1,y1)")

    (func $run
        call $init
        call $drawBackground
        ;;call $test
        call $generate
    )

    (func $generate
      (local $proposedColourMode i32) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
      (local $proposedColour i32) ;; if colourMode is 0, use this, solid colour
      (local $colourSequence i32) ;; if colourMode is 1, use this, as the current sequence
      (local $blendingMode i32) ;; 0 ignore, 1 lighten, 3 darken
      (local $circleCount i32) ;; number of 
      (local $squareCount i32) ;; number of 
      (local $diamondCount i32) ;; number of 
      (local $horizontalLineCount i32) ;; number of 
      (local $verticalLineCount i32) ;; number of 

      (local.set $circleCount (call $getRangedRando(call $getComplexity)(i32.add(call $getComplexity)(i32.const 200))))
      (local.set $squareCount (call $getRangedRando(call $getComplexity)(i32.add(call $getComplexity)(i32.const 200))))
      (local.set $diamondCount (call $getRangedRando(call $getComplexity)(i32.add(call $getComplexity)(i32.const 200))))
      (local.set $horizontalLineCount (i32.add(i32.add(local.get $circleCount)(local.get $squareCount))(local.get $diamondCount)))
      (local.set $verticalLineCount (i32.add(i32.add(local.get $circleCount)(local.get $squareCount))(local.get $diamondCount)))

      (loop $outerloop
        (local.set $proposedColourMode (call $getRangedRando(i32.const 0)(i32.const 3)))      
        (local.set $proposedColour (call $getRandomColour)) ;; if colourMode is 0, use this, solid colour
        (local.set $colourSequence (local.get $circleCount))
        (local.set $blendingMode (i32.const 3)) ;;(call $getRangedRando(i32.const 0)(i32.const 2))) ;; 0 ignore, 1 lighten, 3 darken
        
        (block $break

          ;; if we have run out of circles and squares, break.
          (i32.le_u (local.get $circleCount)(i32.const 0))
          (i32.le_u (local.get $squareCount)(i32.const 0))
          (i32.le_u (local.get $diamondCount)(i32.const 0))
          (i32.le_u (local.get $horizontalLineCount)(i32.const 0))
          (i32.le_u (local.get $verticalLineCount)(i32.const 0))
          i32.and
            br_if $break

          ;; while there are still circles to draw, do so.
          (i32.gt_u (local.get $circleCount)(i32.const 0))
          if
            (call $getRangedRando (i32.const 0)(call $getWidth)) ;; x location on the canvas
            (call $getRangedRando (i32.const 0)(call $getHeight))  ;; y location on the canvas
            (call $getRangedRando (i32.div_u(call $getWidth)(i32.const 16))(i32.div_u(call $getWidth)(i32.const 8))) ;; radius can be up to the width
            ;;(call $getRangedRando(i32.const 50)(i32.const 200))      
            (local.get $proposedColourMode) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
            (local.get $proposedColour) ;; if colourMode is 0, use this, solid colour
            (local.get $colourSequence) ;; if colourMode is 1, use this, as the current sequence
            (local.get $blendingMode) ;; 0 ignore, 1 lighten, 3 darken
            call $drawFilledCircle
            (local.set $circleCount (i32.sub (local.get $circleCount)(i32.const 1)))
            ;;(call $log (i32.const 9)(local.get $circleCount)(local.get $squareCount)(local.get $diamondCount)(i32.const -1))
          end

          ;; while there are still circles to draw, do so.
          (i32.gt_u (local.get $verticalLineCount)(i32.const 0))
          if
            (call $getRangedRando (i32.const 0)(call $getWidth))  ;; y location on the canvas
            (i32.const 0) ;; x location on the canvas
            (call $getRangedRando (i32.const 0)(call $getHeight))  ;; y location on the canvas
            (call $getHeight)
            (local.get $proposedColourMode) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
            (local.get $proposedColour) ;; if colourMode is 0, use this, solid colour
            (local.get $colourSequence) ;; if colourMode is 1, use this, as the current sequence
            (local.get $blendingMode) ;; 0 ignore, 1 lighten, 3 darken
            call $plotLine
            (local.set $verticalLineCount (i32.sub (local.get $verticalLineCount)(i32.const 1)))
            ;;(call $log (i32.const 9)(local.get $circleCount)(local.get $squareCount)(local.get $diamondCount)(i32.const -1))
          end

          ;; while there are still circles to draw, do so.
          (i32.gt_u (local.get $horizontalLineCount)(i32.const 0))
          if
            (i32.const 0) ;; x location on the canvas
            (call $getRangedRando (i32.const 0)(call $getHeight))  ;; y location on the canvas
            (call $getWidth)
            (call $getRangedRando (i32.const 0)(call $getHeight))  ;; y location on the canvas
            (local.get $proposedColourMode) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
            (local.get $proposedColour) ;; if colourMode is 0, use this, solid colour
            (local.get $colourSequence) ;; if colourMode is 1, use this, as the current sequence
            (local.get $blendingMode) ;; 0 ignore, 1 lighten, 3 darken
            call $plotLine
            (local.set $horizontalLineCount (i32.sub (local.get $horizontalLineCount)(i32.const 1)))
            ;;(call $log (i32.const 9)(local.get $circleCount)(local.get $squareCount)(local.get $diamondCount)(i32.const -1))
          end

          ;; while there are still squares to draw do so
          (i32.gt_u (local.get $diamondCount)(i32.const 0))
          if
            (call $getRangedRando (i32.const 0)(call $getWidth)) ;; x location on the canvas
            (call $getRangedRando (i32.const 0)(call $getHeight))  ;; y location on the canvas
            (call $getRangedRando (i32.div_u(call $getWidth)(i32.const 16))(i32.div_u(call $getWidth)(i32.const 8))) ;; radius can be up to the width
            ;;(call $getRangedRando(i32.const 50)(i32.const 200))      
            (local.get $proposedColourMode) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
            (local.get $proposedColour) ;; if colourMode is 0, use this, solid colour
            (local.get $colourSequence) ;; if colourMode is 1, use this, as the current sequence
            (local.get $blendingMode) ;; 0 ignore, 1 lighten, 3 darken
            call $drawFilledDiamond
            (local.set $diamondCount (i32.sub (local.get $diamondCount)(i32.const 1)))
            ;;(call $log (i32.const 11)(local.get $circleCount)(local.get $squareCount)(local.get $diamondCount)(i32.const -1))
          end

          ;; while there are still squares to draw do so
          (i32.gt_u (local.get $squareCount)(i32.const 0))
          if
            (call $getRangedRando (i32.const 0)(call $getWidth)) ;; x location on the canvas
            (call $getRangedRando (i32.const 0)(call $getHeight))  ;; y location on the canvas
            (call $getRangedRando (i32.div_u(call $getWidth)(i32.const 16))(i32.div_u(call $getWidth)(i32.const 8))) ;; radius can be up to the width
            (call $getRangedRando (i32.div_u(call $getWidth)(i32.const 16))(i32.div_u(call $getWidth)(i32.const 8))) ;; radius can be up to the width
            ;;(call $getRangedRando(i32.const 50)(i32.const 200))      
            ;;(call $getRangedRando(i32.const 50)(i32.const 200))      
            (local.get $proposedColourMode) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
            (local.get $proposedColour) ;; if colourMode is 0, use this, solid colour
            (local.get $colourSequence) ;; if colourMode is 1, use this, as the current sequence
            (local.get $blendingMode) ;; 0 ignore, 1 lighten, 3 darken
            call $drawFilledRectangle
            (local.set $squareCount (i32.sub (local.get $squareCount)(i32.const 1)))
          end

          br $outerloop
        )
      )     
    )
    
    (func $test

        ;; change the debug mode for testing
        global.get $g_DEBUGMODE_INDEX
        i32.const 0
        i32.store

      ;; (param $proposedColourMode i32) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
      ;; (param $proposedColour i32) ;; if colourMode is 0, use this, solid colour
      ;; (param $colourSequence i32) ;; if colourMode is 1, use this, as the current sequence
      ;; (param $blendingMode i32) ;; 0 overwrite, 1 lighten, 2 darken
    )

    (func $init
        ;; for each byte of the PK iterate through the message sig
        ;; use the left nibble to determine how far to rotate the version byte left 
        ;; use the right nibble to determine how far to rotate the version nibble right
        ;; there are 24 bytes in the PK (aVal, rVal, gVal, bVal)
        ;; there are 65 bytes in the messageSig
        (local $entropyIndex i32)
        (local $messageSigIterator i32)
        (local $direction i32) ;; direction of rotation
        (local $pkByte i32)

        ;; get the first location where the we can store bytes
        (local.set $entropyIndex (call $getGeneratedEntropyStartMemoryIndex))

        (loop $outerLoop
            (block $publicKey

                ;; if we have generated enough entropy break.
                (i32.eq(local.get $entropyIndex)(call $getEntropyEnd))
                br_if $publicKey 

                ;; reset the iterator for the inner loop
                (local.set $messageSigIterator (i32.const 0))

                ;; get the next chunk of our Public Key (encoded in the pallet)
                (local.set $pkByte (call $getNextPublicKeyByte)) ;; this is what you are rotating it by

                ;; loop through the bytes of our messageSig using the value to rotate them
                ;; alternate between rotate left and rotate right
                (loop $innerLoop
                    (block $messageSig

                        ;; if we have used our message sig bytes, break and grab a new PK
                        (i32.eq(local.get $messageSigIterator)(global.get $g_VERSIOSIG_LENGTH))
                        br_if $messageSig

                        ;; change the direction of rotation as you work through the values
                        (i32.eq(local.get $direction)(i32.const 0))
                        (if
                            (then
                                ;; this is the entropy slot we are trying to fill
                                local.get $entropyIndex

                                ;; load the value at the message sig byte
                                call $getNextVersionSigByte ;; this is the thing you are rotating

                                ;; get colour byte (Public Key)
                                local.get $pkByte
                                i32.rotl ;; rotate the data by that amount
                                i32.const 256
                                i32.rem_u
                                i32.store8 ;; store in entropy index
                                                                
                                (local.set $direction (i32.const 1))
                            )
                            (else
                                ;; this is the entropy slot we are trying to fill
                                local.get $entropyIndex

                                ;; load the value at the message sig byte
                                call $getNextVersionSigByte ;; this is the thing you are rotating

                                local.get $pkByte
                                i32.rotr ;; rotate the data by that amount
                                i32.const 256
                                i32.rem_u
                                i32.store8 ;; store in entropy index

                                (local.set $direction (i32.const 0))                   
                            )
                        )
                        (local.set $entropyIndex (i32.add(local.get $entropyIndex)(i32.const 1)))
                        (local.set $messageSigIterator (i32.add(local.get $messageSigIterator)(i32.const 1)))
                    
                        br $innerLoop
                    )
                )
                br $outerLoop
            )
        )
    
        ;; use the first generated entropy to choose the background colour
        i32.const 0
        global.get $g_PALLET_COLOUR_COUNT
        call $getRangedRando
        call $getColourByIndex
        global.set $g_BACKGROUND_COLOUR

        ;;(call $printWithParameters (i32.const 1400)(call $getWidth)(call $getHeight)(call $getComplexity)(call $getBackgroundColour)(call $getColourMode))
        ;;(call $printWithParameters (i32.const 1400)(call $getWidth)(call $getHeight)(call $getDebugMode)(call $getBackgroundColour)(call $getColourMode))
    )

;; ========================== UTILITY METHODS=============================================    
    (func $getWidth (result i32)
        global.get $g_WIDTH_INDEX
        i32.load
    )

    (func $getHeight (result i32)
        global.get $g_HEIGHT_INDEX
        i32.load
    )

    (func $getPalletMemoryStartIndex (result i32)
        global.get $g_PALLET_START_INDEX        
    )
   
    (func $getPalletColourCount (result i32)
        i32.const 5 ;; we have 5 colours, do this better        
    )

    (func $getComplexity (result i32)
        global.get $g_COMPLEXITY_INDEX
        i32.load8_u
    )

    (func $getBackgroundColour (result i32)
        global.get $g_BACKGROUND_COLOUR
    )

    ;; this will never be above 255
    (func $getColourMode (result i32)
        global.get $g_COLOURMODE_INDEX
        i32.load8_u
    )

    ;; this is a boolean
    (func $getDebugMode (result i32)
        global.get $g_DEBUGMODE_INDEX
        i32.load8_u
    )

    (func $getGeneratedEntropyStartMemoryIndex (result i32)
        global.get $g_VERSIONSIG_START
        global.get $g_VERSIOSIG_LENGTH
        i32.add
    )

    (func $getNextPublicKeyByte (result i32)
        (if (i32.eq(global.get $g_CURRENT_PUBLIC_KEY_INDEX)(call $getPublicKeyEndIndex))
            (then
                global.get $g_PALLET_START_INDEX
                i32.load
                (global.set $g_CURRENT_PUBLIC_KEY_INDEX (i32.add(global.get $g_PALLET_START_INDEX)(i32.const 1)))
                return          
            )
            (else
                global.get $g_CURRENT_PUBLIC_KEY_INDEX
                i32.load
                (global.set $g_CURRENT_PUBLIC_KEY_INDEX (i32.add(global.get $g_CURRENT_PUBLIC_KEY_INDEX (i32.const 1))))
                return            
            )
        )
        i32.const 0
    )

    ;; get the next byte in the version sig, wrap around
    (func $getNextVersionSigByte (result i32)
        (if (i32.eq(global.get $g_CURRENT_VERSIONSIG_INDEX)(call $getVersionSigEndIndex))
            (then
                global.get $g_VERSIONSIG_START
                i32.load
                (global.set $g_CURRENT_VERSIONSIG_INDEX (i32.add(global.get $g_VERSIONSIG_START (i32.const 1))))
                return          
            )
            (else
                global.get $g_CURRENT_VERSIONSIG_INDEX
                i32.load
                (global.set $g_CURRENT_VERSIONSIG_INDEX (i32.add(global.get $g_CURRENT_VERSIONSIG_INDEX (i32.const 1))))
                return            
            )
        )
        i32.const 0
    )

    ;; end byte for the colour pallet
    ;; colour pallet is a variation of the public key val
    (func $getPublicKeyEndIndex (result i32)
        global.get $g_PALLET_START_INDEX
        global.get $g_PALLET_COLOUR_COUNT
        i32.const 4
        i32.mul
        i32.add
    )
    
    (func $getVersionSigEndIndex (result i32)
        global.get $g_VERSIONSIG_START
        global.get $g_VERSIOSIG_LENGTH
        i32.add    
    )
        
    (func $getEntropyEnd (result i32)
        global.get $g_VERSIONSIG_START
        global.get $g_VERSIOSIG_LENGTH
        i32.add    
        global.get $g_BYTES_OF_ENTROPY
        i32.add
    )

    ;; entropy includes the version signature as well as the
    ;; generated entropy
    (func $resetEntropyMemoryIndex
        (global.set $g_CURRENT_ENTROPY_MEMORY_INDEX (global.get $g_VERSIONSIG_START))
    )

    (func $getNextEntropyByte (result i32)
        (local $val i32)

        global.get $g_CURRENT_ENTROPY_MEMORY_INDEX
        i32.load8_u
        local.set $val

        ;;(call $printWithParameters (i32.const 1496)(i32.const 1)(global.get $g_CURRENT_ENTROPY_MEMORY_INDEX)(local.get $val)(i32.const 0)(i32.const 0))

        i32.const 1
        call $incEntropyMemoryIndex
        local.get $val
    )

    (func $getNextEntropy2Byte (result i32)
        (local $val i32)

        global.get $g_CURRENT_ENTROPY_MEMORY_INDEX
        i32.load16_u
        local.set $val

        i32.const 2
        call $incEntropyMemoryIndex

        ;;(call $printWithParameters (i32.const 1496)(global.get $g_CURRENT_ENTROPY_MEMORY_INDEX)(local.get $val)(i32.const 0)(i32.const 0)(i32.const 0))

        local.get $val
    )

    (func $getNextEntropy3Byte (result i32)
        (local $val i32)
        global.get $g_CURRENT_ENTROPY_MEMORY_INDEX
        i32.load ;; load the full 4 bytes
        i32.const 0x00_FF_FF_FF
        i32.and
        local.set $val 

        i32.const 3
        call $incEntropyMemoryIndex

        ;;(call $printWithParameters (i32.const 1496)(global.get $g_CURRENT_ENTROPY_MEMORY_INDEX)(local.get $val)(i32.const 0)(i32.const 0)(i32.const 0))
        
        local.get $val
    )

    (func $getNextEntropy4Byte (result i32)
        (local $val i32)
        global.get $g_CURRENT_ENTROPY_MEMORY_INDEX
        i32.load ;; load the full 4 bytes
        local.set $val 

        i32.const 4
        call $incEntropyMemoryIndex

        ;;(call $printWithParameters (i32.const 1496)(global.get $g_CURRENT_ENTROPY_MEMORY_INDEX)(local.get $val)(i32.const 0)(i32.const 0)(i32.const 0))        

        local.get $val
    )

    ;; move forward a certain number of places in memory
    (func $incEntropyMemoryIndex (param $places i32)
        global.get $g_CURRENT_ENTROPY_MEMORY_INDEX
        local.get $places
        i32.add
        call $getEntropyEnd
        i32.ge_u ;; check to see if we are at the end
        if
            call $resetEntropyMemoryIndex
        end

        ;; move forward the appropraite number of bytes
        (global.set $g_CURRENT_ENTROPY_MEMORY_INDEX (i32.add(global.get $g_CURRENT_ENTROPY_MEMORY_INDEX)(local.get $places)))
    )

    (func $printWithParameters (param $messageStartIndex i32)(param $val0 i32)(param $val1 i32)(param $val2 i32)(param $val3 i32)(param $val4 i32)
        (i32.eq(call $getDebugMode)(i32.const 0))
        if
            return
        end

        (i32.store(global.get $g_ERROR_PARAMETER_START_INDEX)(local.get $val0))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 4))(local.get $val1))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 8))(local.get $val2))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 12))(local.get $val3))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 16))(local.get $val4))

        local.get $messageStartIndex
        call $print 

        ;; reset the values after print
        (i32.store(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 0))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 4))(i32.const 0))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 8))(i32.const 0))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 12))(i32.const 0))
        (i32.store(i32.add(global.get $g_ERROR_PARAMETER_START_INDEX)(i32.const 16))(i32.const 0))
    )

    (func $getCanvasStartIndex (result i32)
        global.get $g_RESERVED_MEM_END_INDEX
    )

    ;; reset the index to the begining of colours
    (func $resetCurrentColourIndex
        (global.set $g_CURRENT_COLOUR_INDEX(call $getPalletMemoryStartIndex))
    )

    ;; use the messageSignature hex values as a set of "random values" that you can pull from
    ;; when a random is chosen the location of the random is moved forward
    ;; could update this by getting only as much from an i32 as is needed
    ;; if you need a random between 0-255, just grab a bite
    ;; if you need a larger random (up to 65535), maybe grab 2 bytes
    (func $getRangedRando(param $minRando i32)(param $maxRando i32)(result i32)
        (local $memRando i32)
        (local $localRando i32)

        ;; don't allow neg value for min
        (i32.lt_u(local.get $minRando)(i32.const 0))
        if
            i32.const 1
        return
        end

        ;; don't allow neg value for max
        (i32.lt_u(local.get $maxRando)(i32.const 1))
        if
            i32.const 1
        return
        end

        ;; don't allow min to be larger than max
        (i32.gt_u(local.get $minRando)(local.get $maxRando))
        if
            (local.set $localRando (local.get $minRando))
            (local.set $minRando (local.get $maxRando))
            (local.set $maxRando (local.get $localRando))
            (local.set $localRando (i32.const 0))
        end

        ;; if the rando we are looking for is less than 256
        ;; we can satisfy it with a byte instead of the 4 bytes
        ;; that make up an i32
        (i32.lt_u (local.get $maxRando)(i32.const 256))
        if
            call $getNextEntropyByte
            local.set $memRando
        end

        ;; max value that can be represented by 2 bytes is 65K
        (i32.ge_u (local.get $maxRando)(i32.const 256))
        (i32.lt_u (local.get $maxRando)(i32.const 65536))
        i32.and
        if
            call $getNextEntropy2Byte
            local.set $memRando
        end

        ;; max value that can be represented by 2 bytes is 65K
        (i32.ge_u (local.get $maxRando)(i32.const 65536))
        (i32.lt_u (local.get $maxRando)(i32.const 16777216))
        i32.and
        if
            call $getNextEntropy3Byte
            local.set $memRando 
        end

        (i32.ge_u (local.get $maxRando)(i32.const 16777216))
        if
            call $getNextEntropy4Byte
            local.set $memRando 
        end

        ;; get our random value up to our max rando
        (local.set $localRando (i32.rem_u(local.get $memRando)(local.get $maxRando)))

        ;; if the generated random is less than the min, set to min
        (i32.lt_u(local.get $localRando)(local.get $minRando))
        if
        (local.set $localRando (local.get $minRando))
        end

        ;; auditing
        ;;(call $printWithParameters (i32.const 1462)(local.get $minRando)(local.get $localRando)(local.get $maxRando)(i32.const 0)(i32.const 0))

        local.get $localRando
    )

;; ========================== UTILITY METHODS=============================================

;; ========================== COLOUR METHODS=============================================
    ;; shade the background
    (func $drawBackground 
        (local $xIterator i32)
        (local $yIterator i32)
        (local $width i32)
        (local.set $xIterator (i32.const 0))
        (local.set $yIterator (i32.const 0))

        ;;(call $printWithParameters (i32.const 1855)(call $getBackgroundColour)(i32.const 0)(i32.const 0)(i32.const 0)(i32.const 0))

        (loop $xAxisLoop
            (block $xAxis

                (i32.eq(local.get $xIterator)(call $getWidth))
                br_if $xAxis

                (local.set $yIterator (i32.const 0))

                (loop $yAxisLoop
                    (block $yAxis
                        (i32.eq(local.get $yIterator)(call $getHeight))
                        br_if $yAxis

                        (call $drawPixel 
                            (i32.const 0) ;; specific location
                            (local.get $xIterator)
                            (local.get $yIterator)
                            (i32.const 0)
                            (i32.const 0) 
                            (call $getWidth) 
                            (call $getHeight) 
                            (i32.const 0) ;; specific colour 
                            (call $getBackgroundColour)
                            (i32.add(local.get $xIterator)(local.get $yIterator)) ;; ignored
                            (i32.const 0)) ;; overwrite

                        (local.set $yIterator (i32.add(local.get $yIterator)(i32.const 1)))
                        br $yAxisLoop
                    )
                )

                (local.set $xIterator (i32.add(local.get $xIterator)(i32.const 1)))
                br $xAxisLoop
            )
        )
    )
       
    ;; return a colour based on an index value
    ;; the index does not need to represent the colours
    ;; location in memory, use rem to ensure it is the correct 
    ;; colour range (between 0 and User Supplied Colour Count)
    (func $getColourByIndex (param $proposedColourIndex i32)(result i32)
        (local $proposedColour i32)        
        call $getPalletMemoryStartIndex
        (i32.rem_u(local.get $proposedColourIndex)(call $getPalletColourCount))
        i32.const 4 ;; each colour is 4 bytes of information
        i32.mul ;; gets the starting location in mem for this colour
        i32.add ;; adds to the starting location in mem for all colour
        i32.load ;; loads the colour at this location
        local.set $proposedColour

        ;;(call $printWithParameters (i32.const 1550)(local.get $proposedColourIndex)(local.get $proposedColour)(i32.const 0)(i32.const 0)(i32.const 0))
    
        local.get $proposedColour
    )

    ;; grab the next colour in the pallet as they were added to it
    ;; they would be orded by public key hex pairs
    ;; caller can use whatever they want for the index
    ;; get colour by index checks the range
    (func $getNextColourSequentially (param $currentIndex i32)(result i32)
        (local $proposedColour i32)
        ;; add one to the supplied colour, range bound it to between 0 and user supplied colours
        local.get $currentIndex
        i32.const 1
        i32.add
        global.get $g_PALLET_COLOUR_COUNT
        i32.rem_u
        call $getColourByIndex
        local.set $proposedColour

        ;;(call $printWithParameters (i32.const 1594)(local.get $currentIndex)(local.get $proposedColour)(i32.const 0)(i32.const 0)(i32.const 0))

        local.get $proposedColour
    )

    ;; use entropy to get a rando within the colour pallet
    (func $getRandomColour (result i32)
        (local $proposedColour i32)
        i32.const 0
        global.get $g_PALLET_COLOUR_COUNT
        call $getRangedRando
        call $getColourByIndex
        local.set $proposedColour
        
        ;;(call $printWithParameters (i32.const 1647)(local.get $proposedColour)(i32.const 0)(i32.const 0)(i32.const 0)(i32.const 0))

        local.get $proposedColour
    )

    ;; are we drawing in the lines?
    ;; returns 1 if we are, 0 if we are not.
    (func $checkBounds 
        (param $proposedXLocation i32) ;; x location of the draw
        (param $proposedYLocation i32) ;; y location of the draw
        (param $boundingBoxMinX i32) ;; mix X location of drawing region
        (param $boundingBoxMinY i32) ;; min Y location of the drawing region
        (param $boundingBoxMaxX i32) ;; max X location of the drawing region
        (param $boundingBoxMaxY i32) ;; max Y location of the drawing region
        (result i32) ;; 0 if not in bounding box, 1 otherwise  
        (local $tmpX i32)
        (local $tmpY i32)

        (i32.lt_u(local.get $boundingBoxMaxX)(local.get $boundingBoxMinX))
        if
          (local.set $tmpX (local.get $boundingBoxMinX))
          (local.set $boundingBoxMaxX (local.get $boundingBoxMinX))
          (local.set $boundingBoxMinX (local.get $tmpX))
        end

        (i32.lt_u(local.get $boundingBoxMaxY)(local.get $boundingBoxMinY))
        if
          (local.set $tmpX (local.get $boundingBoxMinY))
          (local.set $boundingBoxMaxY (local.get $boundingBoxMinY))
          (local.set $boundingBoxMinY (local.get $tmpY))
        end

        (i32.ge_u(local.get $proposedXLocation)(local.get $boundingBoxMinX))
        (i32.le_u(local.get $proposedXLocation)(local.get $boundingBoxMaxX))
        i32.and        
        (i32.ge_u(local.get $proposedYLocation)(local.get $boundingBoxMinY))
        (i32.le_u(local.get $proposedYLocation)(local.get $boundingBoxMaxY))
        i32.and
        i32.and
    )

;; ========================== COLOUR METHODS=============================================


;; ========================== DRAW METHODS=============================================

;; shift the bits around to create a new int32 that represents the 
;; colour we are interested in
(func $setBitsFromVal (param $val i32)(param $bitShift i32)(result i32)
    local.get 0
    local.get 1
    i32.shl
)

;; make the color more opaque
(func $changeTransparency(param $blendingMode i32)(param $startingColour i32)(result i32)
    (local $newColour i32)

    (i32.eq(local.get $blendingMode)(i32.const 1))
    if
        ;; get the alpha value
        local.get $startingColour
        i32.const 0xFF_00_00_00
        i32.and
        i32.const 24
        i32.shr_u
        global.get $g_OPACITY_ADJUSTMENT ;; this could come in +/-
        i32.sub
        i32.const 256    
        i32.rem_u
        i32.const 24
        i32.shl
        ;; get the remainder
        local.get $startingColour
        i32.const 0x00_FF_FF_FF
        i32.and
        
        ;; add the changed alpha
        i32.add
        local.set $newColour
    end

    (i32.eq(local.get $blendingMode)(i32.const 2))
    if
        ;; get the alpha value
        local.get $startingColour
        i32.const 0xFF_00_00_00
        i32.and
        i32.const 24
        i32.shr_u
        global.get $g_OPACITY_ADJUSTMENT ;; this could come in +/-
        i32.add ;; reduce opacity
        i32.const 256    
        i32.rem_u
        i32.const 24
        i32.shl
        ;; get the remainder
        local.get $startingColour
        i32.const 0x00_FF_FF_FF
        i32.and
        
        ;; add the changed alpha
        i32.add
        local.set $newColour
    end

    ;;(call $printWithParameters (i32.const 2160)(local.get $startingColour)(global.get $g_OPACITY_ADJUSTMENT)(local.get $newColour)(i32.const 0)(i32.const 0))

    local.get $newColour
)

;; return the correct memory location
(func $getPixelMemoryLocation (param $proposedXLocation i32)(param $proposedYLocation i32)(result i32)
    ;; map to the correct memory location
    local.get $proposedYLocation
    call $getHeight
    i32.mul
    local.get $proposedXLocation
    i32.add ;; $proposedXLocation+$proposedYLocation*$cnvs_size (get pixels into linear memory)
    i32.const 4
    i32.mul ;; multiply by 4 because each pixel is 4 bytes
    global.get $g_RESERVED_MEM_END_INDEX
    i32.add
)

(func $getColourAtLocation (param $proposedXLocation i32)(param $proposedYLocation i32)(result i32)
    (call $getPixelMemoryLocation (local.get $proposedXLocation)(local.get $proposedYLocation))
    i32.load
)

(func $setColourAtLocation (param $proposedXLocation i32)(param $proposedYLocation i32)(param $proposedColour i32)
    (local $memLocation i32)
    (local.tee $memLocation (call $getPixelMemoryLocation (local.get $proposedXLocation)(local.get $proposedYLocation)))
    local.get $proposedColour
    i32.store

    ;;(call $printWithParameters (i32.const 2118)(local.get $proposedXLocation)(local.get $proposedYLocation)(i32.add(global.get $g_RESERVED_MEM_END_INDEX)(local.get $memLocation))(local.get $proposedColour)(i32.const 0))
)

;; used for random colourful shit
(func $drawRandomColourPixel (param $proposedXLocation i32) (param $proposedYLocation i32)(param $blendingMode i32)
    (call $drawPixel 
        (i32.const 0)
        (local.get $proposedXLocation)
        (local.get $proposedYLocation)
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (i32.const 0) ;; specific colour 
        (call $getColourByIndex (call $getRangedRando(i32.const 0)(global.get $g_PALLET_COLOUR_COUNT)))
        (i32.const 0) ;; colour sequence ignored
        (i32.const 0)) ;; overwrite
)

;; sued for super colourful shit
(func $drawPixelNextColourSequentially (param $proposedXLocation i32) (param $proposedYLocation i32) (param $sequenceNumber i32)
    (call $drawPixel 
        (i32.const 0) ;; specific location
        (local.get $proposedXLocation)
        (local.get $proposedYLocation)
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (i32.const 1) ;; next Sequential 
        (i32.const 0) ;; colour ignored
        (local.get $sequenceNumber) ;; use this number a sequence #
        (i32.const 0)) ;; overwrite
)

;;- placement mode
;;  0 specific, x and y have to be non-zero
;;  1 random, x and y are ignored and pulled randomly
;;- colour mode can be
;;  0 solid, in which case colour has to be valid non-zero
;;  1 next colour in pallet, ignore colour
;;  2 random colour in pallet, ignore colour
(func $drawPixel 
    (param $placementMode i32) ;; 0 specific, 1 random
    (param $proposedXLocation i32) ;; specific x location for draw
    (param $proposedYLocation i32) ;; specific y location for draw
    (param $boundingBoxMinX i32) ;; min x coord for bounding box
    (param $boundingBoxMinY i32) ;; min x coord for bounding box
    (param $boundingBoxMaxX i32) ;; max y coord for bounding box
    (param $boundingBoxMaxY i32) ;; max y coord for bounding box
    (param $proposedColourMode i32) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
    (param $proposedColour i32) ;; if colourMode is 0, use this, solid colour
    (param $colourSequence i32) ;; if colourMode is 1, use this, as the current sequence
    (param $blendingMode i32) ;; 0 ignore, 1 lighten, 3 darken
    (local $finalX i32) ;; if the placement mode is random use this to track X
    (local $finalY i32) ;; if the placement mode is random use this to track y
    (local $colour i32) ;; 0 overwrite, 1 lightencolour, 2 average, 3 darken

    ;; =========== Placement Start

    ;; check to see that the pix is within the correct bounding
    (i32.eq(local.get $placementMode)(i32.const 0))
    (call $checkBounds (local.get $proposedXLocation)(local.get $proposedYLocation)(local.get $boundingBoxMinX)(local.get $boundingBoxMinY)(local.get $boundingBoxMaxX)(local.get $boundingBoxMaxY))
    i32.and
    (if
        (then
            (local.set $finalX (local.get $proposedXLocation))
            (local.set $finalY (local.get $proposedYLocation))
        )
        (else
            return ;; we are trying to draw either x or y outside of our bounds
        )
    )    

    ;; place the pixel randomly
    (i32.eq(local.get $placementMode)(i32.const 1))
    if
        (local.set $finalX (call $getRangedRando(local.get $boundingBoxMinX)(local.get $boundingBoxMaxX)))
        (local.set $finalY (call $getRangedRando(local.get $boundingBoxMinY)(local.get $boundingBoxMaxY)))
    end

    ;; =========== Placement End

    ;; =========== Colouring Start

    ;; use proposed colour
    (i32.eq(local.get $proposedColourMode)(i32.const 0))
    if
        (local.set $colour (local.get $proposedColour))
    end

    ;; get next sequential from the pallet
    (i32.eq(local.get $proposedColourMode)(i32.const 1))
    if
        ;; use the provided sequence value to determine where we are in the colour pallet
        ;; this can be any number (it is force ranged between 0....5 to match the colour pallet)
        (local.set $colour (call $getNextColourSequentially(local.get $colourSequence)))
    end

    ;; get a random colour from the pallet
    ;; uses the entropy we have generated during initialization
    (i32.eq(local.get $proposedColourMode)(i32.const 2))
    if
        (local.set $colour (call $getRandomColour))
    end

    ;; =========== Colouring End

    ;; =========== Blending Start

    ;; no blending
    (i32.eq (local.get $blendingMode)(i32.const 0))
    if
        (call $printWithParameters (i32.const 1822)(local.get $finalX)(local.get $finalY)(local.get $colour)(i32.const 0)(i32.const 0))
    end

    ;; increase transparency
    (i32.eq (local.get $blendingMode)(i32.const 1))
    if
        ;; if there is a colour there, belend it
        (i32.ne(call $getColourAtLocation(local.get $finalX)(local.get $finalY))(i32.const 0))
        if
            ;; increase transparency
            (local.set $colour (call $changeTransparency (local.get $blendingMode)(local.get $colour)))
        end
        
        (call $printWithParameters (i32.const 1684)(local.get $finalX)(local.get $finalY)(local.get $blendingMode)(global.get $g_OPACITY_ADJUSTMENT)(local.get $colour))    
    end

    ;; increase opacity
    (i32.eq(local.get $blendingMode)(i32.const 2))
    if
        ;; if there is a colour there, belend it
        (i32.ne(call $getColourAtLocation(local.get $finalX)(local.get $finalY))(i32.const 0))
        if
            ;; reduce transparency
            (local.set $colour (call $changeTransparency (local.get $blendingMode)(local.get $colour)))
        end
        (call $printWithParameters (i32.const 1776)(local.get $finalX)(local.get $finalY)(local.get $blendingMode)(global.get $g_OPACITY_ADJUSTMENT)(local.get $colour))
    end
    ;; =========== Blending End

    (call $setColourAtLocation (local.get $finalX)(local.get $finalY)(local.get $colour))
)

  ;; Draw a line low
  (func $plotLineLow 
    (param $xStart i32) 
    (param $yStart i32)
    (param $xEnd i32) 
    (param $yEnd i32) 
    (param $proposedColourMode i32) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
    (param $proposedColour i32) ;; if colourMode is 0, use this, solid colour
    (param $colourSequence i32) ;; if colourMode is 0, use this, solid colour
    (param $blendingMode i32)
    (local $dx i32)
    (local $dy i32)
    (local $yi i32)
    (local $slopeChange i32)
    (local $xCurrent i32)
    (local $yCurrent i32)
    (local $xi i32)
    (local $tmp i32)

    ;; dx = x1-x0
    (local.set $dx (i32.sub (local.get $xEnd)(local.get $xStart)))

    ;; dy = y1-y0
    (local.set $dy (i32.sub (local.get $yEnd)(local.get $yStart)))

    (local.set $yi (i32.const 1)) ;; yi = 1

    (call $printWithParameters (i32.const 2254)(local.get $xStart)(local.get $yStart)(local.get $xEnd)(local.get $yEnd)(local.get $proposedColourMode))

    (if (i32.lt_s (local.get $dy)(i32.const 0) ) ;; if dy < 0
     (then
      (local.set $yi (i32.const -1))
      (local.set $dy (i32.mul (local.get $dy)(i32.const -1)))
     )
    )

    ;; D = (2 * dy) - dx
    (local.set $slopeChange (i32.sub (i32.mul (i32.const 2)(local.get $dy)) (local.get $dx) ))

    (local.set $xCurrent(local.get $xStart))
    
    (local.set $yCurrent(local.get $yStart))

    (loop $outloop

      (if(i32.lt_s (local.get $xCurrent) (local.get $xEnd))
        (then          
          (call $drawPixel 
            (i32.const 0)
            (local.get $xCurrent)
            (local.get $yCurrent)
            (i32.const 0) 
            (i32.const 0) 
            (call $getWidth) 
            (call $getHeight)
            (local.get $proposedColourMode) 
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode))          
          (if (i32.gt_s (local.get $slopeChange)(i32.const 0))
            (then
              (local.set $yCurrent(i32.add (local.get $yCurrent)(local.get $yi)))
              (local.set $slopeChange (i32.add (local.get $slopeChange)(i32.mul (i32.const 2) (i32.sub (local.get $dy)(local.get $dx)))))
            )
            (else
              (local.set $slopeChange (i32.add (local.get $slopeChange) (i32.mul (i32.const 2) (local.get $dy))))
            )
          )
          (local.set $xCurrent(i32.add (i32.const 1)(local.get $xCurrent)))
          br $outloop
        )      
      )    
    )
    (call $drawPixel 
        (i32.const 0)
        (local.get $xCurrent)
        (local.get $yCurrent)
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight)
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))          
  )

  ;; Draw a line high
  (func $plotLineHigh 
    (param $xStart i32) 
    (param $yStart i32)
    (param $xEnd i32) 
    (param $yEnd i32) 
    (param $proposedColourMode i32) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
    (param $proposedColour i32) ;; if colourMode is 0, use this, solid colour
    (param $colourSequence i32) ;; if colourMode is 0, use this, solid colour
    (param $blendingMode i32)
    (local $dx i32)
    (local $dy i32)
    (local $yi i32)
    (local $slopeChange i32)
    (local $xCurrent i32)
    (local $yCurrent i32)
    (local $xi i32)

    ;; dx = x1-x0
    (local.set $dx (i32.sub (local.get $xEnd)(local.get $xStart)))

    ;; dy = y1-y0
    (local.set $dy (i32.sub (local.get $yEnd)(local.get $yStart)))

    (call $printWithParameters (i32.const 2286)(local.get $xStart)(local.get $yStart)(local.get $xEnd)(local.get $yEnd)(local.get $proposedColourMode))
    (call $printWithParameters (i32.const 2286)(local.get $dx)(local.get $dy)(i32.const 0)(i32.const 0)(i32.const 0))

    (local.set $xi (i32.const 1)) ;; xi = 1

    (if (i32.lt_s (local.get $dx)(i32.const 0) ) ;; if dx < 0
     (then
      (local.set $xi (i32.const -1))
      (local.set $dx (i32.mul (local.get $dx)(i32.const -1)))
     )
    )

    ;; D = (2 * dx) - dy
    (local.set $slopeChange ( i32.sub (i32.mul (i32.const 2)(local.get $dx)) (local.get $dy) ))

    (local.set $xCurrent(local.get $xStart))
    
    (local.set $yCurrent(local.get $yStart))

        (call $drawPixel 
            (i32.const 0) ;; draw at specific locations
            (local.get $xCurrent)
            (local.get $yCurrent)
            (i32.const 0) 
            (i32.const 0) 
            (call $getWidth) 
            (call $getHeight) 
            (local.get $proposedColourMode) 
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode))      
    
    (loop $outloop
      (if(i32.lt_s (local.get $yCurrent) (local.get $yEnd))
        (then

          (call $drawPixel 
            (i32.const 0) ;; draw at specific location
            (local.get $xCurrent)
            (local.get $yCurrent)
            (i32.const 0) 
            (i32.const 0) 
            (call $getWidth) 
            (call $getHeight) 
            (local.get $proposedColourMode) 
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode))          

          (if (i32.gt_s (local.get $slopeChange)(i32.const 0))
            (then
              (local.set $xCurrent(i32.add (local.get $xCurrent)(local.get $xi)))
              (local.set $slopeChange (i32.add (local.get $slopeChange) (i32.mul (i32.const 2) (i32.sub (local.get $dx)(local.get $dy)))))
            )
            (else
              (local.set $slopeChange (i32.add (local.get $slopeChange) (i32.mul (i32.const 2) (local.get $dx))))
            )
          )
          (local.set $yCurrent(i32.add (i32.const 1)(local.get $yCurrent)))
          br $outloop
        )      
      )
    )
        (call $drawPixel 
            (i32.const 0) ;; draw at specific location
            (local.get $xCurrent)
            (local.get $yCurrent)
            (i32.const 0) 
            (i32.const 0) 
            (call $getWidth) 
            (call $getHeight)
            (local.get $proposedColourMode) 
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode))          
  )

  ;; draw a line, use the start and end and slope to determine what sub-function we are calling
  ;; https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
  
  (func $plotLine 
    (param $xStart i32) 
    (param $yStart i32)
    (param $xEnd i32) 
    (param $yEnd i32) 
    (param $proposedColourMode i32) ;; 0 specific, 1 next sequential from pallet, 2 random from pallet
    (param $proposedColour i32) ;; if colourMode is 0, use this, solid colour
    (param $colourSequence i32) ;; if colourMode is 0, use this, solid colour
    (param $blendingMode i32)
    (local $dx i32)
    (local $dy i32)

    ;; dx = x1-x0    
    (local.set $dx (i32.trunc_f32_s(f32.abs (f32.convert_i32_s (i32.sub (local.get $xEnd)(local.get $xStart))))))

    ;; dy = y1-y0
    (local.set $dy (i32.trunc_f32_s(f32.abs (f32.convert_i32_s (i32.sub (local.get $yEnd)(local.get $yStart))))))

    (call $printWithParameters (i32.const 2229)(local.get $xStart)(local.get $xEnd)(local.get $yStart)(local.get $yEnd)(i32.const 0))
    (call $printWithParameters (i32.const 2229)(local.get $dx)(local.get $dy)(i32.const 0)(i32.const 0)(i32.const -1))

    (if ( i32.lt_u (local.get $dy)(local.get $dx) ) ;; 
      (then
        (if ( i32.gt_s (local.get $xStart)(local.get $xEnd) )
          (then
            (call $plotLineLow 
                (local.get $xEnd)
                (local.get $yEnd)
                (local.get $xStart)
                (local.get $yStart)
                (local.get $proposedColourMode)
                (local.get $proposedColour)
                (local.get $colourSequence)
                (local.get $blendingMode))          
          )
          (else          
            (call $plotLineLow 
                (local.get $xStart)
                (local.get $yStart)
                (local.get $xEnd)
                (local.get $yEnd)
                (local.get $proposedColourMode)
                (local.get $proposedColour)
                (local.get $colourSequence)
                (local.get $blendingMode))          
          )
        )
      )
      (else
        (if (i32.gt_s (local.get $yStart)(local.get $yEnd) )
          (then
            (call $plotLineHigh 
                (local.get $xEnd)
                (local.get $yEnd)
                (local.get $xStart)
                (local.get $yStart)
                (local.get $proposedColourMode)
                (local.get $proposedColour)
                (local.get $colourSequence)
                (local.get $blendingMode))          
          )
          (else          
            (call $plotLineHigh 
                (local.get $xStart)
                (local.get $yStart)
                (local.get $xEnd)
                (local.get $yEnd)
                (local.get $proposedColourMode)
                (local.get $proposedColour)
                (local.get $colourSequence)
                (local.get $blendingMode))          
          )
        )
      )
    )
  )

    ;; draw a centre point rectangle, the width and height are at 1/2 size (makes the calc easier)
  ;; draw it at a specific colour
  (func $drawCentrePointRect 
    (param $xCentre i32)
    (param $yCentre i32)
    (param $halfWidth i32)
    (param $halfHeight i32)
    (param $proposedColourMode i32)
    (param $proposedColour i32)
    (param $colourSequence i32)
    (param $blendingMode i32)          
    (local $xStartPoint i32)
    (local $xEndPoint i32)
    (local $yStartPoint i32)
    (local $yEndPoint i32)
    
    ;; are we drawing on our canvas?
    (i32.lt_u (local.get $xCentre)(i32.const 0))  
    (i32.lt_u (local.get $yCentre)(i32.const 0))  
    i32.or
    if
      return
    end

    ;; no use drawinga 0 width rect.
    (i32.lt_u (local.get $halfWidth)(i32.const 0))  
    (i32.lt_u (local.get $halfHeight)(i32.const 0))  
    i32.or
    if
      return
    end

    ;; calculate the end points for the lines
    (local.set $xStartPoint (i32.sub(local.get $xCentre)(local.get $halfWidth)))
    (local.set $xEndPoint (i32.add(local.get $xCentre)(local.get $halfWidth)))
    (local.set $yStartPoint (i32.sub(local.get $yCentre)(local.get $halfHeight)))
    (local.set $yEndPoint (i32.add(local.get $yCentre)(local.get $halfHeight)))

    ;; use the calculated end points to draw lines
    (call $plotLine 
        (local.get $xStartPoint)
        (local.get $yStartPoint)
        (local.get $xEndPoint)
        (local.get $yStartPoint)
        (local.get $proposedColourMode)
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))  
    (call $plotLine 
        (local.get $xStartPoint)
        (local.get $yEndPoint)
        (local.get $xEndPoint)
        (local.get $yEndPoint)
        (local.get $proposedColourMode)
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))  
    (call $plotLine 
        (local.get $xStartPoint)
        (local.get $yStartPoint)
        (local.get $xStartPoint)
        (local.get $yEndPoint)
        (local.get $proposedColourMode)
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))  
    (call $plotLine 
        (local.get $xEndPoint)
        (local.get $yStartPoint)
        (local.get $xEndPoint)
        (local.get $yEndPoint)
        (local.get $proposedColourMode)
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))    

       ;;(call $printWithParameters (i32.const 2071)(local.get $xCentre)(local.get $yCentre)(local.get $halfWidth)(local.get $halfHeight)(local.get $proposedColour))
    )  

  ;; draw a centre-point circle at a particular location, radius, and colour
  ;; adapted from http://rosettacode.org/wiki/Bitmap/Midpoint_circle_algorithm
  (func $centrePointCircle 
    (param $xCentre i32)
    (param $yCentre i32)
    (param $radius i32)
    (param $proposedColourMode i32)
    (param $proposedColour i32)
    (param $colourSequence i32)
    (param $blendingMode i32) 
    (local $x i32)
    (local $y i32)
    (local $d i32)
    (local $tmp i32)

    (local.set $x (i32.const 0))
    (local.set $y (local.get $radius))
    ;; int d = 3 - 2 * r;
    (local.set $d (i32.sub (i32.const 3)(i32.mul (i32.const 2)(local.get $radius))))

    (call $drawPixelGroup(local.get $xCentre)(local.get $yCentre)(local.get $x)(local.get $y)(local.get $proposedColourMode)(local.get $proposedColour)(local.get $colourSequence)(local.get $blendingMode))

    ;;(call $log (i32.const 99)(local.get $proposedColour)(i32.const -1)(i32.const -1)(i32.const -1))

    (loop $outerloop
      (if (i32.ge_s(local.get $y)(local.get $x))
        (then
          ;; x++
          (local.set $x (i32.add(local.get $x)(i32.const 1)))
        
          (if (i32.gt_s(local.get $d)(i32.const 0))
            (then
              ;; y--
              (local.set $y (i32.sub(local.get $y)(i32.const 1)))
              ;; d = d + 4 * (x - y) + 10;
              ;; (x - y)
              (local.set $tmp (i32.sub(local.get $x)(local.get $y)))
              ;; d = d + 4 * tmp + 10;
              (local.set $d (i32.add(i32.add(local.get $d)(i32.mul(i32.const 4)(local.get $tmp))(i32.const 10))))
            )
            (else
              ;;d = d + 4 * x + 6;
              (local.set $d (i32.add(i32.add(local.get $d)(i32.mul(i32.const 4)(local.get $x))(i32.const 6))))
            )
          )
          (call $drawPixelGroup(local.get $xCentre)(local.get $yCentre)(local.get $x)(local.get $y)(local.get $proposedColourMode)(local.get $proposedColour)(local.get $colourSequence)(local.get $blendingMode))
          br $outerloop
        )
      )
    ) 
  )

  ;; used to draw the extreme top, bottom, left, right pixels for the circle.
  (func $drawPixelGroup
    (param $xCentre i32)
    (param $yCentre i32)
    (param $x i32)
    (param $y i32)
    (param $proposedColourMode i32)
    (param $proposedColour i32)
    (param $colourSequence i32)
    (param $blendingMode i32) 

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.add(local.get $xCentre)(local.get $x))
        (i32.add(local.get $yCentre)(local.get $y))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))


    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.sub(local.get $xCentre)(local.get $x))
        (i32.add(local.get $yCentre)(local.get $y))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.add(local.get $xCentre)(local.get $x))
        (i32.sub(local.get $yCentre)(local.get $y))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.sub(local.get $xCentre)(local.get $x))
        (i32.sub(local.get $yCentre)(local.get $y))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.add(local.get $xCentre)(local.get $y))
        (i32.add(local.get $yCentre)(local.get $x))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.sub(local.get $xCentre)(local.get $y))
        (i32.add(local.get $yCentre)(local.get $x))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.add(local.get $xCentre)(local.get $y))
        (i32.sub(local.get $yCentre)(local.get $x))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))

    (call $drawPixel 
        (i32.const 0) ;; draw at specific location
        (i32.sub(local.get $xCentre)(local.get $y))
        (i32.sub(local.get $yCentre)(local.get $x))
        (i32.const 0) 
        (i32.const 0) 
        (call $getWidth) 
        (call $getHeight) 
        (local.get $proposedColourMode) 
        (local.get $proposedColour)
        (local.get $colourSequence)
        (local.get $blendingMode))
  )

  ;; draw a rectangle, solid fill it with this provided colour from the pallet index
  ;; this isn't required for production but used for testing (may remove)
  (func $drawFilledRectangle 
    (param $xCentre i32) 
    (param $yCentre i32)
    (param $halfWidth i32) 
    (param $halfHeight i32)
    (param $proposedColourMode i32)
    (param $proposedColour i32)
    (param $colourSequence i32)
    (param $blendingMode i32)          

    (loop $outerloop 
      
      ;; if the colour mode is next sequential shift the colour to next in pallet
      (i32.eq(local.get $proposedColourMode)(i32.const 1))
      if
        (local.set $colourSequence (local.get $halfWidth))
      end

      ;; if the colour mode is next sequential shift the colour to next in pallet
      (i32.eq(local.get $proposedColourMode)(i32.const 2))
      if
        (local.set $proposedColour (call $getRandomColour))
      end

      (block $break
        local.get $xCentre
        local.get $yCentre
        local.get $halfWidth
        local.get $halfHeight
        local.get $proposedColourMode
        local.get $proposedColour
        local.get $colourSequence
        local.get $blendingMode          
        call $drawCentrePointRect

        (i32.eq(local.get $halfWidth)(i32.const 0))
        (i32.eq(local.get $halfHeight)(i32.const 0))
        i32.or
          br_if $break

        ;; shrink the rectangle
        (local.set $halfWidth (i32.sub (local.get $halfWidth)(i32.const 1)))
        (local.set $halfHeight (i32.sub (local.get $halfHeight)(i32.const 1)))

        br $outerloop
      )
    )
  )

    ;; draw a filled circle randomly grab colours from the pallet
  (func $drawFilledCircle 
    (param $xCentre i32) 
    (param $yCentre i32)
    (param $radius i32)
    (param $proposedColourMode i32)
    (param $proposedColour i32)
    (param $colourSequence i32)
    (param $blendingMode i32)      

    (loop $outerloop 

      ;; if the colour mode is next sequential shift the colour to next in pallet
      (i32.eq(local.get $proposedColourMode)(i32.const 1))
      if
        (local.set $colourSequence (local.get $radius))
      end

      ;; if the colour mode is next sequential shift the colour to next in pallet
      (i32.eq(local.get $proposedColourMode)(i32.const 2))
      if
        (local.set $proposedColour (call $getRandomColour))
      end
      
      (block $break

        ;; if the radius is 0 no need to continue
        (i32.eq (local.get $radius)(i32.const 0))
        if
            (call $drawPixel 
                (i32.const 0) ;; draw at specific location
                (local.get $xCentre)
                (local.get $yCentre)
                (i32.const 0) 
                (i32.const 0) 
                (call $getWidth) 
                (call $getHeight) 
                (local.get $proposedColourMode) 
                (local.get $proposedColour)
                (local.get $colourSequence)
                (local.get $blendingMode)
            )
            br $break
        end
        
        (call $centrePointCircle 
            (local.get $xCentre)
            (local.get $yCentre)
            (local.get $radius)
            (local.get $proposedColourMode) 
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode)  
        )        
        ;; shrink the radius
        (local.set $radius (i32.sub (local.get $radius)(i32.const 1)))

        br $outerloop
      )
    )  
  )

  (func $drawFilledDiamond 
    (param $xCentre i32)
    (param $yCentre i32)
    (param $length i32)
    (param $proposedColourMode i32)
    (param $proposedColour i32)
    (param $colourSequence i32)
    (param $blendingMode i32)   
    (local $yTop i32)
    (local $yBottom i32)
    (local $currentColour i32)
    (local $xMin i32)
    (local $xMax i32)

    (local.set $yTop (i32.sub(local.get $yCentre)(local.get $length)))
    (local.set $yBottom (i32.add(local.get $yCentre)(local.get $length)))    
    (local.set $xMin (i32.sub(local.get $xCentre)(local.get $length)))
    (local.set $xMax (i32.add(local.get $xCentre)(local.get $length)))

    ;;(call $log (i32.const 2)(local.get $xCentre)(local.get $yTop)(local.get $xMin)(local.get $xMax))

    (loop $outerloopTop 
      (block $breakTop

        ;; if the colour mode is next sequential shift the colour to next in pallet
        (i32.eq(local.get $proposedColourMode)(i32.const 1))
        if
          (local.set $colourSequence (local.get $xMin))
        end

        ;; if the colour mode is next sequential shift the colour to next in pallet
        (i32.eq(local.get $proposedColourMode)(i32.const 2))
        if
          (local.set $proposedColour (call $getRandomColour))
        end

        (i32.ge_u (local.get $xMin)(local.get $xCentre))
          br_if $breakTop

        ;;top left quadrant - fail
        (call $plotLine 
            (local.get $xCentre)
            (local.get $yTop)
            (local.get $xMin)
            (local.get $yCentre)
            (local.get $proposedColourMode)
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode)
        )
        
        ;;top right quad - works?
        (call $plotLine 
            (local.get $xCentre)
            (local.get $yTop)
            (local.get $xMax)
            (local.get $yCentre)
            (local.get $proposedColourMode)
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode)
        )

        ;; bottom left quad
        (call $plotLine
            (local.get $xCentre)
            (local.get $yBottom)
            (local.get $xMin)
            (local.get $yCentre)
            (local.get $proposedColourMode)
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode)
        ) 

        ;; bottom right quad - fail
        (call $plotLine 
            (local.get $xCentre)
            (local.get $yBottom)
            (local.get $xMax)
            (local.get $yCentre)
            (local.get $proposedColourMode)
            (local.get $proposedColour)
            (local.get $colourSequence)
            (local.get $blendingMode)
        )  

        (local.set $xMin (i32.add(local.get $xMin)(i32.const 2)))
        (local.set $xMax (i32.sub(local.get $xMax)(i32.const 2)))

        br $outerloopTop
      )
    )   
  )

;; ========================== DRAW METHODS=============================================

    (start $run)
)