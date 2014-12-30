(function (xml_file_path, results_folder) {

    try {

        //@include "../../../../../lib/photoshop/photoshop-lib.jsx"
        PS.Config.init();

        // create a new document
        PS.Document.create(100, 100, 72, 'document_to_test', NewDocumentMode.CMYK);

        // get the resolution
        var resolution = PS.Document.get_resolution();

        // save it as PSD
        PS.Document.save_to_PSD(results_folder + '/test.psd');

        // save it as TIFF
        PS.Document.save_to_TIFF(results_folder + '/test.tif');

        // save it as jpg for web
        PS.Document.save_for_web_JPG(results_folder + '/test_web_jpg.jpg', 60);

        // close it
        PS.Document.close(SaveOptions.DONOTSAVECHANGES);

        // open a document
        PS.Document.open(results_folder + '/test.psd');

        // get the name
        var name_of_document = app.activeDocument.name;

        // close the document
        PS.Document.close(SaveOptions.DONOTSAVECHANGES);


        /*********************************************
         *
         * Read and update the xml file
         *
         **********************************************/

        var content = H.XML.read(xml_file_path);

        // add the node
        var root = new XML(content);


        var unit_test_open_image = new XML("<unit-test id='open_image'>" + name_of_document + "</unit-test>");
        root.appendChild(unit_test_open_image);


        var unit_test_resolution = <unit-test id ='resolution'>{resolution}</unit-test>;
        root.appendChild(unit_test_resolution);

        // update xml file
        H.XML.write(xml_file_path, root);
    }

    catch (ex) {
        alert('file: ' + ex.fileName + '\n message: ' + ex.message + '\n line: ' + ex.line);
    }

}).apply(this, [].slice.apply(this.arguments));

