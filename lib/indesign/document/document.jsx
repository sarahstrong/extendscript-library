﻿/** * Module with indesign document functions * @namespace Document * @memberOf IN * @author Bastien Eichenberger */IN.Document = (function (my) {    /**     * Function to save a document     * @param {string} file_path     * @param {InDesign Document} [document] if no document is given use the active document by default     * @returns {*}     */    my.save = function (file_path, document) {        if (document === undefined) {            var document = app.activeDocument;        }        return document.save(new File(file_path));    }    /**     * Function to open a document     * @param {string} file_path the path to the InDesign Document     * @returns {InDesign Document}     */    my.open = function (file_path) {        var my_file = new File(file_path);        if (!my_file.exists) {            throw {                name: 'InvalidArgumentError',                message: 'The file do not exist',                fileName: $.fileName,                lineNumber: $.line            };        }        return app.open(my_file);    }    /**     * Function to create a new document     * @param {number} width the document width     * @param {number} height the document height     * @returns {number} the document with the specified index     */    my.create = function (width, height) {        var doc = app.documents.add({            documentPreferences: {                pageWidth: width,                pageHeight: height            }        });        return doc;    }    /**     * Function to close the active InDesign document or the document passed as parameter     * @function close     * @memberOf IN.Document     * @param {SaveOptions} save_options NO, ASK, YES     * @param {InDesign Document} [document] the document to save     */    my.close = function (save_options, document) {        if (document === undefined) {            var document = app.activeDocument;        }        if (save_options !== SaveOptions.NO            && save_options !== SaveOptions.ASK            && save_options !== SaveOptions.YES) {            throw {                name: 'InvalidArgumentError',                message: 'you must enter a valid value for the param save_option [NO, ASK, YES]',                fileName: $.fileName,                lineNumber: $.line            };        }        document.close(save_options);    }    /**     * Function to close all documents     * @param {SaveOptions} save_options NO, ASK, YES     * @param {Documents} [documents] a collection of documents to close, if empty all document are closed     */    my.close_all = function (save_options, documents) {        if (documents === undefined) {            var documents = app.documents;        }        while (documents.count()) {            my.close(save_options, documents.item(-1));        }    }    /**     * Function who return true if one link is out of date     * @function out_of_date_link     * @memberOf IN.Document     * @param {Document} document the indesign document     * @return {Boolean} true if a link is out of date     */    my.out_of_date_link = function (document) {        for (var i = 0; i < document.links.length; i++) {            var current_link = document.links[i];            if (current_link.status === LinkStatus.LINK_OUT_OF_DATE) {                return true;            }        }        return false;    }    /**     * Function who return true if one link is missing     * @function is_missing_link     * @memberOf IN.Document     * @param {Document} document the indesign document     * @return {Boolean} true if a link is missing     */    my.is_missing_link = function (document) {        for (var i = 0; i < document.links.length; i++) {            var current_link = document.links[i];            if (current_link.status === LinkStatus.LINK_MISSING) {                return true;            }        }        return false;    }    /**     * Function who return true if one fonts is not installed     * @function is_font_uninstalled     * @param {Document} [document]     * @return {boolean} true if a font is uninstalled     */    my.is_font_uninstalled = function (document) {        if (document === undefined) {            var document = app.activeDocument;        }        var fonts = document.fonts;        for (var i = 0; i < fonts.length; i++) {            if (fonts[i].status !== FontStatus.INSTALLED) {                return true;            }        }        return false;    }    /**     * Function to package document, links, fonts     * @function package     * @memberOf IN.Document     * @param {string} directories_path_str the path where to store the new document     * @param {Document} [document] the indesign document     * @param {object} [options] object with package options     * @example     *     {     *         to: current_folder,     *         copyingFonts: true,     *         copyingLinkedGraphics: true,     *         copyingProfiles: false,     *         updatingGraphics: true,     *         includingHiddenLayers: false,     *         ignorePreflightErrors: true,     *         creatingReport: true,     *         versionComments: undefined,     *         forceSave: true     *     };     * @returns {string} the path of the new document     * @throws {Error} if an error occurred during the package for print     */    my.package = function (directories_path_str, document, options) {        if (document === undefined) {            var document = app.activeDocument;        }        var current_date = new Date();        var folder_package = new Folder(directories_path_str);        if (folder_package.exists === false) {            folder_package.create();        }        var current_folder = new Folder(folder_package + "/" + current_date.year_month_day() + "_" + current_date.hours_minutes_seconds());        current_folder.create();        var options = options || {                to: current_folder,                copyingFonts: true,                copyingLinkedGraphics: true,                copyingProfiles: false,                updatingGraphics: true,                includingHiddenLayers: false,                ignorePreflightErrors: true,                includeIdml: false, // only in CC                includePdf: false, // only in CC                pdfStyle: undefined, // only in CC                creatingReport: true,                versionComments: undefined,                forceSave: true            };        // There is 3 new parameters in CC        if (parseFloat(app.version) >= 10){            document.packageForPrint(                options.to,                options.copyingFonts,                options.copyingLinkedGraphics,                options.copyingProfiles,                options.updatingGraphics,                options.includingHiddenLayers,                options.ignorePreflightErrors,                options.creatingReport,                options.includeIdml,                options.includePdf,                options.pdfStyle,                options.versionComments,                options.forceSave            );                    }        else {            document.packageForPrint(                options.to,                options.copyingFonts,                options.copyingLinkedGraphics,                options.copyingProfiles,                options.updatingGraphics,                options.includingHiddenLayers,                options.ignorePreflightErrors,                options.creatingReport,                options.versionComments,                options.forceSave            );        }        if (!File(current_folder + "/" + document.name).exists) {            throw {                name: 'Error',                message: 'Something has gone wrong and the package for print file do not exist \n' +                'Please check if the document is saved before. The document cannot used uninstalled external modules',                fileName: $.fileName,                line: $.line            };        }        return current_folder + "/" + document.name;    }    /**     * Function to copy an InDesign document     * @param {string} doc_path the new document path: xxx/xxx/document.indd     * @param {Document} [document] the document to copy     */    my.copy = function (doc_path, document) {        if (document === undefined) {            var document = app.activeDocument;        }        var file_copy = new File(doc_path);        return document.saveACopy(file_copy);    }    /**     * Function to copy the fonts     * @todo this functions works only with fonts: true type or otf -> postscript fonts are composites (2 files are required)     * @param {string} folder_path     * @param {Document} [document] the document     */    my.fonts = function (folder_path, document) {        if (document === undefined) {            var document = app.activeDocument;        }        var fonts = document.fonts;        var folder_fonts = new Folder(folder_path);        folder_fonts.create();        if (!folder_fonts.exists) {            throw {                name: 'InvalidArgumentError',                message: 'the argument folder_path' + folder_path + 'is not a valid file path',                fileName: $.fileName,                lineNumber: $.line            };        }        var current_font;        for (var i = 0; i < fonts.length; i++) {            current_font = new File(fonts[i].location);            current_font.copy(new File(folder_fonts + '/' + current_font.name));        }    }    /**     * Function to copy all links     * @param {string} folder_path     * @param {Document} document     */    my.links = function (folder_path, document) {        if (document === undefined) {            var document = app.activeDocument;        }        var links = document.links;        var folder_links = new Folder(folder_path);        folder_links.create();        if (!folder_links.exists) {            throw {                name: 'InvalidArgumentError',                message: 'the argument folder_path' + folder_path + 'is not a valid file path',                fileName: $.fileName,                lineNumber: $.line            };        }        var current_link;        for (var i = 0; i < links.length; i++) {            current_link = new File(links[i].filePath);            current_link.copy(new File(folder_links + '/' + current_link.name));        }    }    /**     * Function to export an InDesign document as PDF     * @function export_as_PDF     * @memberOf IN.Document     * @param {Document} document the document to export     * @param {string} file_path the file path of the PDF     * @param {string } preset_name the name of the PDF export preset     * @param {string} [page_range] the page range     * @example     * export page from 1-10 -> '1-10'     * export page from 1-2, 4-6 -> '1-2, 4-6'     * export all pages -> PageRange.ALL_PAGES     * @param {InDesign Document} [document] the document to export     * @throws {InvalidArgumentError}     * @todo if the parameter page_range is not correct the function export all pages of the PDF,     * it would be better to inform the user and throw an exeption     */    my.export_as_PDF = function (file_path, preset_name, page_range, document) {        if (page_range === undefined) {            var page_range = PageRange.ALL_PAGES;        }        if (document === undefined) {            var document = app.activeDocument;        }        var my_file = new File(file_path);        var export_preset = app.pdfExportPresets.item(preset_name);        if (!export_preset.isValid) {            throw {                name: 'InvalidArgumentError',                message: 'The argument preset_name ' + preset_name + ' does not exist',                fileName: $.fileName,                line: $.line            };        }        app.pdfExportPreferences.pageRange = page_range;        document.exportFile(ExportFormat.pdfType, my_file, false, export_preset);    }    /**     * Function to export an InDesign document as PDF     * @function export_as_JPG     * @memberOf IN.Document     * @param {string} file_path the file path of the PDF     * @param {JPEGOptionsQuality} quality [HIGH, LOW, MEDIUM, MAXIMUM]     * @param {number} resolution the resolution of the JPEG     * @param {InDesign Document} [document] the document to export     * @todo add export page range function!     */    my.export_as_JPG = function (file_path, quality, resolution, document) {        if (document === undefined) {            var document = app.activeDocument;        }        var my_file = new File(file_path);        app.jpegExportPreferences.jpegQuality = quality;        app.jpegExportPreferences.exportResolution = resolution;        app.jpegExportPreferences.jpegExportRange = ExportRangeOrAllPages.EXPORT_ALL;        document.exportFile(ExportFormat.JPG, my_file, false);    }    return my;})(IN.Document || {});