from os import listdir
from os.path import isfile, join
mypath = '/Users/kevinowocki/Desktop/nfts'
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
for file in onlyfiles:
    name = file.replace('.png', '')
    print(name)
    continue
    output = '{   "name":"NAME Moonshot Bot",   "description":"NAME is a Moonshot Bots that builds coordination for public good.",   "image":"https://gateway.pinata.cloud/ipfs/QmX56GPN2iB9QG2s6qjFcBdaELDj5tLDUDsB2dQ7Dxt3Hj/nfts/NAME.png",   "external_url":"https://bots.moonshotcollective.space",   "background_color":"ffffff",   "attributes":[   ]}'
    output = output.replace('NAME', name)

    output_file = file.replace('.png', '.json')
    text_file = open(output_file, "w")
    n = text_file.write(output)
    text_file.close()
