import { getScale, checkSelection, checkLastLayerName, loadLocalImage } from './helper/general'

var sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Style = sketch.Style
var SharedStyle = sketch.SharedStyle

var document = sketch.getSelectedDocument()
var selection = document.selectedLayers
var selected_artboard = selection.layers[0]

var scale = getScale()

export default function() {

  if ( checkSelection() ) {

    var last_layer = selected_artboard.layers[0]
    var artboard_id = selected_artboard.id
    
    if ( !checkLastLayerName(last_layer.name) ) {
      UI.message("😅 Copycat layer not found, run 'Create Copycat' first")
      return
    }

    //_____ Update copycat in selected Artboard _____

    var export_options = { scales: scale, formats: 'png', 'use-id-for-name': true, 'save-for-web': true }
    sketch.export(selected_artboard, export_options)

    var atScale = scale == 1 ? '' : `@${scale}x`
    var file_path = `~/Documents/Sketch Exports/${String(artboard_id)}${atScale}.png`
    var file_abspath = NSString.stringWithString(file_path).stringByExpandingTildeInPath()

    var local_image = loadLocalImage(file_abspath)

    var kotakPattern = { patternType: Style.PatternFillType.Fill, image: local_image };

    if (!local_image) {
      UI.message("😢 Can't load image!")
      return
    }

    last_layer.style.fills[0].pattern = kotakPattern

    if (last_layer.sharedStyleId) {
      var sharedStyle = document.sharedLayerStyles.find(function(style) {
        return style.id == last_layer.sharedStyleId;
      });

      sharedStyle.style = last_layer.style;

      sharedStyle.getAllInstancesLayers().forEach(function(instance_layer) {
        instance_layer.style = last_layer.style;
      });

    }

    selection.clear()

  }

}