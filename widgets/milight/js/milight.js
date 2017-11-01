/*
    ioBroker.milight Widget-Set
    version: "0.0.3"
    Copyright foxthefox 
    adapted from iobroker.vis-jqui, jqui-mfd

*/

"use strict";



// add translations for edit mode

if (vis.editMode) {
    $.extend(systemDictionary, {
        "oid-level":        {"en": "brightness",    "de": "Helligkeit"},
        "oid-colormode":    {"en": "mode switch",   "de": "Modus Schalter"},
        "oid-color":        {"en": "color value",    "de": "Farbewert"},
        "oid-disco":        {"en": "disco mode",    "de": "Disco mode"},
        "oid-speedup":      {"en": "speed up",      "de": "speed up"},
        "oid-speeddown":    {"en": "speed down",    "de": "speed down"},
        "oid-discospeeddown": {"en": "speed down", "de": "speed down"},
        "oid-discospeedup": {"en": "speed up",      "de": "speed up"},
        "oid-ctemp": {"en": "white color temp", "de": "weiß Farbtemperatur"},
        "oid-saturation": {"en": "color saturation", "de": "Farbsättigung"},
        "oid-mode": {"en": "Effect Mode switch", "de": "Effect Modus Schalter"},
    });
}

vis.binds.milightui = {

    version: "0.0.3",

    showVersion: function() {

        if (vis.binds.milightui.version) {
            console.log('Milight widget version: ' + vis.binds.milightui.version);
            vis.binds.milightui.version = null;
        }
    },
    //; vis.binds.musiccast.buttonToggle(el, data.value)
    buttonToggle: function (el, val) {
        var $this = $(el);
        var oid = $this.attr('data-oid');

        if (!$(el).data('no-style')) {
            setTimeout(function () {
                $(el).button();
            }, 0);
        }
        $(el).click(function () {
            if (val === undefined || val === null) val = false;
            if (val === 'true')  val = true;
            if (val === 'false') val = false;
            if (parseFloat(val).toString() == val) val = parseFloat(val);
            if (!vis.editMode) vis.setValue(oid, val);
        });
    },
    state: function (el, oid) {
        var $this = $(el);
        var oid = (oid ? oid : $this.attr('data-oid'));
        var val = $this.attr('data-val');

        if (oid) $this.attr('data-oid', oid);

        if (val === 'true')  val = true;
        if (val === 'false') val = false;

        if (!vis.editMode) {
            $this.on('click touchstart', function (e) {
                // Protect against two events
                if (vis.detectBounce(this)) return;

                var oid = $(this).attr('data-oid');

                if ($(this).attr('url-value')) {
                    vis.conn.httpGet($(this).attr('url-value'));
                }

                if (oid) {
                    var val = $(this).attr('data-val');
                    if (val === undefined || val === null) val = false;
                    if (val === 'true')  val = true;
                    if (val === 'false') val = false;
                    if (parseFloat(val).toString() == val) val = parseFloat(val);

                    if (oid) vis.setValue(oid, val);
                }
            });
        }
    },
    milightColormode: function (el, oid) {
        var $hue = $(el).parent().find('.hue-mode-hue');
        if (vis.states.attr(oid + '.val') === 'ct' || vis.states.attr(oid + '.val') == 0 ) {
            $hue.hide();
        } else {
            $hue.show();
        }

        vis.states.bind(oid + '.val', function (e, newVal, oldVal) {
            if (newVal === 'ct') {
                $hue.hide();
            } else {
                $hue.show();
            }
        });
    },
    milightRGBWWColormode: function (el, oid) {
        var $hue = $(el).parent().find('.hue-mode-hue');
        var $ct  = $(el).parent().find('.hue-mode-ct');
        if (vis.states.attr(oid + '.val') == 0) {
            $hue.hide();
            $ct.show();
        } else {
            $ct.hide();
            $hue.show();
        }

        vis.states.bind(oid + '.val', function (e, newVal, oldVal) {
            if (newVal == 0 ) {
                $hue.hide();
                $ct.show();
            } else {
                $ct.hide();
                $hue.show();
            }
        });
    }
};

vis.binds.milightui.showVersion();
