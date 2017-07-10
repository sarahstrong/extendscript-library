﻿/** * Function to build the view * @return {Object} the view object with all ui elements */var mainView = function () {    /***********************************************     * Public     ***********************************************/    var that = {};    that.ui = new UI(TRANS.VIEW.TITLE.printf(CONSTANTS.VERSION.toString()),        {            alignChildren: 'left',            resizeable: true        }    );    // pans    that.pans = {};    that.row = that.ui.group('row', {orientation: 'row', alignChildren: 'top'});    that.column_left = that.row.group('row', {orientation: 'column', alignChildren: 'left'});    that.pans.layers = that.column_left.panel(TRANS.VIEW.LAYERS, {        orientation: 'column',        alignChildren: 'left'    });    that.pans.items = that.column_left.panel(TRANS.VIEW.ITEMS, {orientation: 'column'});    that.pans.target = that.column_left.panel(TRANS.VIEW.TARGETS, {        orientation: 'column'    });    // groups    that.grps = {};    that.grps.items_1 = that.pans.items.group('actions', {        orientation: 'column',        alignChildren: 'left',        alignment: ['left', 'center']    });    that.grps.target = that.pans.target.group(TRANS.VIEW.TARGETS, {        orientation: 'row',        alignChildren: 'left',        alignment: ['left', 'center'],        size: [600, 50]    });    that.grps.nav = that.ui.group('nav', {orientation: 'row', alignment: 'right'});    that.items_textframes = that.grps.items_1.add('checkbox', 'Textframes');    that.items_graphics = that.grps.items_1.add('checkbox', 'Graphics');    that.items_others = that.grps.items_1.add('checkbox', 'Others');    // controls target    that.target_add = that.grps.target.add('button', TRANS.VIEW.BTN_TARGET);    that.target_path = that.grps.target.add('statictext', TRANS.VIEW.BTN_TARGET_PLACEHOLDER, undefined, {size: [600, 50]});    // nav    that.stop = that.grps.nav.add('button', 'stop', undefined, {name: 'cancel'});    that.run = that.grps.nav.add('button', TRANS.VIEW.RUN, undefined, {name: 'ok'});    return that;}