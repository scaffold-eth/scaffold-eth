import json

names = ['algorithm','analog','app','application','array','backup','bandwidth','binary','bit','bite','bitmap','blog','blogger','bookmark','boot','broadband','browser','buffer','bug','bus','byte','cache','caps lock','captcha','CD','CD-ROM','client','clip art','clip board','cloud computing','command','compile','compress','computer','computer program','configure','cookie','copy','CPU ','cybercrime','cyberspace','dashboard','data','data mining','database','debug','decompress','delete','desktop','development','digital','disk','DNS ','document','domain','domain name','dot','dot matrix','download','drag','DVD','dynamic','email','emoticon','encrypt','encryption','enter','exabyte','FAQ (frequently asked questions)','file','finder','firewall','firmware','flaming','flash','flash drive','floppy disk','flowchart','folder','font','format','frame','freeware','gigabyte','graphics','hack','hacker','hardware','home page','host','html','hyperlink','hypertext','icon','inbox','integer','interface','Internet','IP address','iteration','Java','joystick','junk mail','kernel','key','keyboard','keyword','laptop','laser printer','link','Linux','log out','logic','login','lurking','Macintosh','macro','mainframe','malware','media','memory','mirror','modem','monitor','motherboard','mouse','multimedia','net','network','node','notebook computer','offline','online','open source','operating system','option','output','page','password','paste','path','phishing','piracy','pirate','platform','plug-in','podcast','pop-up','portal','print','printer','privacy','process','program','programmer','protocol','queue','QWERTY','RAM','real-time','reboot','resolution','restore','ROM (read only memory)','root','router','runtime','save','scan','scanner','screen','screenshot','script','scroll','scroll bar','search engine','security','server','shareware','shell','shift','shift key','snapshot','social networking','software','spam','spammer','spreadsheet','spyware','status bar','storage','supercomputer','surf','syntax','table','tag','teminal','template','terabyte','text editor','thread','toolbar','trash','Trojan horse','typeface','undo','Unix','upload','URL','user','user interface','username','utility','version','virtual','virtual memory','virus','web','web host','webmaster','website','widget','wiki','window','Windows','wireless','word processor','workstation','World Wide Web','worm','WWW','XML','JSON','hacker','cypherpunk','zip']
adjectives = ['abrupt','acidic','adorable','adventurous','aggressive','agitated','alert','aloof','amiable','amused','annoyed','antsy','anxious','appalling','appetizing','apprehensive','arrogant','ashamed','astonishing','attractive','average','batty','beefy','bewildered','biting','bitter','bland','blushing','bored','brave','bright','broad','bulky','burly','charming','cheeky','cheerful','chubby','clean','clear','cloudy','clueless','clumsy','colorful','colossal','combative','comfortable','condemned','condescending','confused','contemplative','convincing','convoluted','cooperative','corny','costly','courageous','crabby','creepy','crooked','cruel','cumbersome','curved','cynical','dangerous','dashing','decayed','deceitful','deep','defeated','defiant','delicious','delightful','depraved','depressed','despicable','determined','dilapidated','diminutive','disgusted','distinct','distraught','distressed','disturbed','dizzy','drab','drained','dull','eager','ecstatic','elated','elegant','emaciated','embarrassed','enchanting','encouraging','energetic','enormous','enthusiastic','envious','exasperated','excited','exhilarated','extensive','exuberant','fancy','fantastic','fierce','filthy','flat','floppy','fluttering','foolish','frantic','fresh','friendly','frightened','frothy','frustrating','funny','fuzzy','gaudy','gentle','ghastly','giddy','gigantic','glamorous','gleaming','glorious','gorgeous','graceful','greasy','grieving','gritty','grotesque','grubby','grumpy','handsome','happy','harebrained','healthy','helpful','helpless','high','hollow','homely','horrific','huge','hungry','hurt','icy','ideal','immense','impressionable','intrigued','irate','irritable','itchy','jealous','jittery','jolly','joyous','filthy','flat','floppy','fluttering','foolish','frantic','fresh','friendly','frightened','frothy','frustrating','funny','fuzzy','gaudy','gentle','ghastly','giddy','gigantic','glamorous','gleaming','glorious','gorgeous','graceful','greasy','grieving','gritty','grotesque','grubby','grumpy','handsome','happy','harebrained','healthy','helpful','helpless','high','hollow','homely','horrific','huge','hungry','hurt','icy','ideal','immense','impressionable','intrigued','irate','irritable','itchy','jealous','jittery','jolly','joyous','juicy','jumpy','kind','lackadaisical','large','lazy','lethal','little','lively','livid','lonely','loose','lovely','lucky','ludicrous','macho','magnificent','mammoth','maniacal','massive','melancholy','melted','miniature','minute','mistaken','misty','moody','mortified','motionless','muddy','mysterious','narrow','nasty','naughty','nervous','nonchalant','nonsensical','nutritious','nutty','obedient','oblivious','obnoxious','odd','old-fashioned','outrageous','panicky','perfect','perplexed','petite','petty','plain','pleasant','poised','pompous','precious','prickly','proud','pungent','puny','quaint','quizzical','ratty','reassured','relieved','repulsive','responsive','ripe','robust','rotten','rotund','rough','round','salty','sarcastic','scant','scary','scattered','scrawny','selfish','shaggy','shaky','shallow','sharp','shiny','short','silky','silly','skinny','slimy','slippery','small','smarmy','smiling','smoggy','smooth','smug','soggy','solid','sore','sour','sparkling','spicy','splendid','spotless','square','stale','steady','steep','responsive','sticky','stormy','stout','straight','strange','strong','stunning','substantial','successful','succulent','superficial','superior','swanky','sweet','tart','tasty','teeny','tender','tense','terrible','testy','thankful','thick','thoughtful','thoughtless','tight','timely','tricky','trite','troubled','twitter pated','uneven','unsightly','upset','uptight','vast','vexed','victorious','virtuous','vivacious','vivid','wacky','weary','whimsical','whopping','wicked','witty','wobbly','wonderful','worried','yummy','zany','zealous','zippy']
whats = [ 
    'that builds coordination for public good',
    'thats straight chillin',
    'thats is here for the scene',
    'thats is here for the vibes',
    'thats looking for the Quadratic Lands',
    'thats SolarPunk AF',
    'thats here to be Austins hype man',
    'thats chillin and shillin',
    'thats coordinatin so we can coordinate to create better coordination',
    'thats on the lookout for freeloaders',
]
def filename_ize(word):
    return word.capitalize().replace(' ','_').replace(')','_').replace('(','_')

def name_attributes(key, val):
    if key == 'theme':
        if val == 'PixelBot':
            val = 'MoonBot'
        if val == 'qpix':
            val = 'QuadraticMoonBot'
    if key == 'legs':
        if val == '1':
            val = 'two'
        if val == '2':
            val = 'one'
        if val == '3':
            val = 'two strong'
    if key == 'mouth':
        if val == '1':
            val = 'confused'
        if val == '2':
            val = 'concerned'
        if val == '3':
            val = 'smile'
    if key == 'eye':
        if val == '1':
            val = 'circular'
        if val == '2':
            val = 'wide'
        if val == '3':
            val = 'thin'
    if key == 'head':
        if val == '1':
            val = 'standard'
        if val == '2':
            val = 'armour'
        if val == '3':
            val = 'antennae'
    if key == 'body':
        if val == '1':
            val = 'muscles'
        if val == '2':
            val = 'medium'
        if val == '3':
            val = 'thin'
    if key == 'Accessory':
        if val == '1':
            val = 'cape'
        if val == '2':
            val = 'lolly pop'
        if val == '3':
            val = 'video game controller'
        if val == '4':
            val = 'lightbulb'
        if val == '5':
            val = 'ice cream'
        if val == '6':
            val = 'mask'
    if key == 'background':
        if val == '1':
            val = 'blue'
        if val == '2':
            val = 'snazzy'
        if val == '3':
            val = 'stripes'
        if val == '4':
            val = 'city'
        if val == '5':
            val = 'clouds'
        if val == '6':
            val = 'abstract'
        if val == '7':
            val = 'metaverse'
    if key == 'arms':
        if val == '1':
            val = 'standard'
        if val == '2':
            val = 'snazzy'
        if val == '3':
            val = 'muscles'
        if val == '4':
            val = 'pinchers'
        if val == '5':
            val = 'thin'
        if val == '6':
            val = 'sword'
        if val == '7':
            val = 'shell'
        if val == '8':
            val = 'dancing'
        if val == '9':
            val = 'shuffles'
    return val

import random
from django.utils import timezone
then = timezone.now() - timezone.timedelta(minutes=60)
from avatar.models import CustomAvatar
avatars = CustomAvatar.objects.filter(created_on__gt=then, profile__handle='owocki')
print(avatars.count())
for avatar in avatars:
    if avatar.png:
        random.shuffle(names)
        random.shuffle(adjectives)
        random.shuffle(whats)
        name = f"{filename_ize(adjectives[0])}_{filename_ize(names[0])}"
        attributes = {
            'theme': avatar.config['theme'][0],
            'descriptor': adjectives[0].capitalize(),
            'name': names[0].capitalize(),
        }
        for item in avatar.config.get('ids[]', []):
            key = item.split('_')[0]
            val = item.split('_')[-1]
            attributes[key] = val
        for _key in attributes.keys():
            attributes[_key] = name_attributes(_key, attributes[_key])
        json_blob = {
           "name":f"{name.replace('_',' ')} Moonshot Bot",
           "description":f"{name.replace('_',' ')} is a Moonshot Bot {whats[0]}.",
           "image":f"HOST_URL_{name}.png",
           "external_url":"https://bots.moonshotcollective.space",
           "background_color":"ffffff",
           "attributes":[
              {
                 "trait_type": key,
                 "value": value
              } for key, value in attributes.items()
           ]
        }
        print(f"curl {avatar.png.url} --output {name}.png")
        print(f"echo '{json.dumps(json_blob)}' > {name}.json")
