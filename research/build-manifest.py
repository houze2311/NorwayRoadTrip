"""Rebuild manifest, file:// data bundle and credits after a reviewed selection change."""
from pathlib import Path
import json,re,html
from PIL import Image
root=Path(__file__).resolve().parents[1]
locations=json.loads((root/'assets/data/locations.json').read_text())
selection=json.loads((root/'research/selection.json').read_text())
pages=json.loads((root/'research/selected-full-metadata.json').read_text())['query']['pages']
fallback=json.loads((root/'research/selected-fallback-metadata.json').read_text())['query']['pages']
def clean(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
notes={
'saksa':'Saksa itself is photographed from Øye; these are not summit panoramas. The preferred official summit imagery requires separate permission.',
'flotvatnet':'The source identifies the waterfall beside Flotvatnet. This June photograph includes the lake foreground and lingering snow; it is square, not a summer panorama.',
'reinanuten':'The source identifies Reinanuten as the ridge at the left of this panorama of Buerbreen. This is not a view taken from the summit.',
'lysebotn':'The first photo includes Lysebotn village and its valley below the hairpins; the second looks from the village toward the fjord. Neither is a drone overview of the entire village and fjord.',
'nedre-oscarshaug':'The photograph shows the Oscarshaug observation structure and surrounding mountains.',
'gamle-strynefjellsvegen':'The photograph shows Hellstuguvatnet and Raudeggi along the route; the road itself is not the main subject.',
'stalheimskleiva':'A contemporary photograph of a hairpin is used instead of the historical colourised image returned by search.',
'geiranger':'Village view. The wider view from Flydalsjuvet is reserved for the separate Flydalsjuvet stop.'}
alts={
'saksa':['Sunbeams over Saksa and the fjord shore at Øye','The pointed summit of Saksa seen from Øye'],
'romsdalen':['The Rauma River and Trolltindane above green Romsdalen','Romsdalshorn and the Romsdalen valley from Litlefjellet','The towering Trolltindane wall above Romsdalen'],
'skagefla':['Skageflå farm on its green ledge above Geirangerfjord','Skageflå farm perched on the fjord cliffs','A wide panorama of Geirangerfjord from Skageflå'],
'besseggen':['Besseggen ridge between turquoise Gjende and blue Bessvatnet','The narrow Besseggen ridge dividing two contrasting lakes','Bessvatnet and Gjende on opposite sides of Besseggen'],
'nigardsbreen':['Nigardsbreen glacier tongue above its turquoise meltwater lake','Blue ice and meltwater at Nigardsbreen in 2021','Nigardsbreen descending between mountains in Jostedalen'],
'flotvatnet':['Waterfall beside Flotvatnet with the lake in the foreground and June snow'],
'reinanuten':['Buerbreen glacier panorama with Reinanuten’s ridge at the left'],
'trolltunga':['Trolltunga rock above Ringedalsvatnet in clear weather','A hiker on Trolltunga above the lake','Trolltunga and Ringedalsvatnet with snow-covered mountains'],
'preikestolen':['Preikestolen plateau and the steep cliff above Lysefjord','Preikestolen and Lysefjord seen from an elevated viewpoint','Wide panorama of Lysefjord with Preikestolen on the right'],
'lysebotn':['Lysebotn village in its green valley below the mountain hairpins','A view over Lysebotn toward the head of Lysefjord'],
'kjerag':['Kjeragbolten wedged between the cliffs with Lysefjord beyond'],
'gamle-strynefjellsvegen':['Hellstuguvatnet and Raudeggi along Gamle Strynefjellsvegen'],
'nedre-oscarshaug':['Oscarshaug observation platform facing the Hurrungane mountains']}
for li,(loc,ids) in enumerate(zip(locations,selection)):
 loc['images']=[]
 if loc['id'] in notes:loc['selectionNote']=notes[loc['id']]
 for pi,id in enumerate(ids):
  page=pages[str(id)];info=page['imageinfo'][0];m=info['extmetadata'];src=f"assets/images/{loc['id']}-{pi+1:02}.jpg"
  path=root/src
  if not path.exists():raise RuntimeError(f'Missing asset {path}')
  width,height=Image.open(path).size
  loc['images'].append(dict(src=src,preview=src.replace('.jpg','-preview.jpg'),source='Wikimedia Commons',sourceUrl=info['descriptionurl'],originalUrl=info['url'],downloadUrl=fallback.get(str(id),page)['imageinfo'][0].get('thumburl',info['url']),photographer=('Ximonic (Simo Räsänen)' if id==48042333 else clean(m.get('Artist',{}).get('value',''))),license=clean(m.get('LicenseShortName',{}).get('value','')),licenseUrl=m.get('LicenseUrl',{}).get('value',''),title=page['title'][5:],alt=alts.get(loc['id'],[])[pi] if loc['id'] in alts else clean(page['title'][5:].rsplit('.',1)[0]),width=width,height=height,verified=True,verification='Manually inspected the photograph and its source caption; see destination selectionNote where applicable.',verifiedOn='2026-10-08',changes='Resized and JPEG recompressed; no content edits. Gallery preview uses a CSS crop; TV mode shows the full frame.'))
# Replace selected broad links with researched destination sources.
urls={0:'https://www.fjordnorway.com/en/see-and-do/hiking-trip-to-saksa-1073-moh',1:'https://www.unionoye.no/en/',6:'https://www.visitnorway.com/places-to-go/fjord-norway/scenic-route-geiranger-trollstigen/',9:'https://www.nasjonaleturistveger.no/en/routes/gamle-strynefjellsvegen/',11:'https://www.visitnorway.com/places-to-go/eastern-norway/the-jotunheimen-mountains/hiking-the-besseggen-ridge/',13:'https://www.nasjonaleturistveger.no/no/turistvegene/sognefjellet/nedre-oscarshaug/',15:'https://www.visitnorway.com/listings/nigardsbreen/111298/',24:'https://www.fjordnorway.com/no/se-og-gjore/reinanuten',28:'https://www.fjordnorway.com/en/attractions/lysebotn'}
for i,u in urls.items():locations[i]['official']=u
text=json.dumps(locations,ensure_ascii=False,indent=2)+'\n'
(root/'assets/data/locations.json').write_text(text)
(root/'assets/data/locations.js').write_text('// Generated from locations.json; enables offline file:// loading.\nwindow.NORWAY_LOCATIONS = '+text.rstrip()+';\n')
license_note='Official tourism photography remains linked because reusable permissions were not established for this private presentation. Visit Norway says to contact its team before using site photographs; Fjord Norway’s image bank generally serves the tourism trade, organisers and press. Norwegian Scenic Routes permits specified uses subject to credits, but its image host could not be downloaded in this environment. The local photographs below are individually licensed Commons alternatives, selected manually, never searched at runtime.'
parts=['<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Norway · Photography credits</title><link rel="stylesheet" href="assets/gallery.css"><main style="padding-top:50px"><a href="index.html">← Back to the gallery</a><h1 style="font-size:64px">The photographers.</h1><p>'+license_note+'</p><p><a href="https://www.visitnorway.com/meetings/media-pack/">Visit Norway terms</a> · <a href="https://www.fjordnorway.com/en/imageshop">Fjord Norway terms</a> · <a href="https://www.nasjonaleturistveger.no/en/press/image-bank">Scenic Routes terms</a></p>']
for p in locations:
 parts.append('<section><h2>'+html.escape(p['name'])+'</h2>')
 if p.get('selectionNote'):parts.append('<p>'+html.escape(p['selectionNote'])+'</p>')
 for im in p['images']:
  parts.append('<p><a href="'+html.escape(im['sourceUrl'])+'">'+html.escape(im['title'])+'</a><br>'+html.escape(im['photographer'])+' · <a href="'+html.escape(im['licenseUrl'])+'">'+html.escape(im['license'])+'</a> · '+str(im['width'])+' × '+str(im['height'])+'<br><small>'+html.escape(im['changes'])+'</small></p>')
 parts.append('</section>')
parts.append('</main></html>');(root/'ATTRIBUTIONS.html').write_text('\n'.join(parts))
print(len(locations),'destinations;',sum(len(p['images']) for p in locations),'photos')
