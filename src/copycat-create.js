import { checkSelection, checkLastLayerName, loadLocalImage } from './helper/general'

var sketch = require('sketch/dom')
var UI = require('sketch/ui')
var ShapePath = sketch.ShapePath
var Rectangle = sketch.Rectangle
var Style = sketch.Style

var Dialog = require("./helper/dialog").dialog;
var _ui = require("./helper/dialog").ui;

var document = sketch.getSelectedDocument()
var selection = document.selectedLayers
var selected_artboard = selection.layers[0]

export default function() {

  if ( checkSelection() ) {

    var last_layer = selected_artboard.layers[0]
    var artboard_id = selected_artboard.id
    var artboard_frame = selected_artboard.frame
    
    if ( checkLastLayerName(last_layer.name) ) {
      UI.message("😅 Already have copycat layer, run 'Update Copycat' instead")
      return
    }

    //_____ Create copycat in selected Artboard _____

    var dialog = new Dialog(
      "Create Copycat",
      "Create hidden layer as Artboard layout"
    )

    var layoutView = NSView.alloc().initWithFrame(NSMakeRect(0, 0, 300, 50))
    layoutView.setFlipped(true)

    var labelView1 = _ui.textLabel("Layout Name", [0, 0, 300, 20])
    layoutView.addSubview(labelView1)

    var nameView = _ui.textField("", [0, 20, 300, 24])
    layoutView.addSubview(nameView)

    dialog.addView(layoutView)
    dialog.focus(nameView)

    var responseCode = dialog.run()
    var layout_name = String(nameView.stringValue())

    if (responseCode === 1000) {

      if (layout_name.length === 0) {
        UI.message("😡 Layout name must not empty!")
        return
      }

      var export_options = { scales: '1', formats: 'png', 'use-id-for-name': true, 'save-for-web': true }
      sketch.export(selected_artboard, export_options)

      var file_path = '~/Documents/Sketch Exports/' + String(artboard_id) + '.png'
      var file_abspath = NSString.stringWithString(file_path).stringByExpandingTildeInPath()

      var local_image = loadLocalImage(file_abspath)

      var kotakPattern = { patternType: Style.PatternFillType.Fill, image: local_image };

      if (!local_image) {
        UI.message("😢 Can't load image!")
        return
      }

      var kotak = new ShapePath({
        parent: selected_artboard,
        name: '#copycat-' + layout_name,
        frame: new Rectangle(0, 0, artboard_frame.width, artboard_frame.height),
        style: { 
          fills: [
            {
              fill: Style.FillType.Pattern,
              pattern: kotakPattern
            }
          ]
        }
      })

      if (kotak) {
        document.sharedLayerStyles.push({
          name: '__copycat/' + layout_name,
          style: kotak.style,
        })

        document.sharedLayerStyles.forEach(sharedLayerStyle => {
          if (sharedLayerStyle.name === '__copycat/' + layout_name) {
            kotak.sharedStyleId = sharedLayerStyle.id
          }
        })

        kotak.hidden = true
        kotak.moveToBack()
      }

    }
    
    selection.clear()

  }

}