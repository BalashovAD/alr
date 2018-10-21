$(document).ready(function () {
    $("#btnConvert").attr("disabled","disabled");
});

function loadOutputFormats(control) {
    let parts = control.value.split(".");
    if (1 < parts.length) {
        //Getting file"s extension
        let ext = parts[parts.length - 1];
        if ((null != ext) && ("" != ext)) {
            //Checking allowed extensions
            upperExt = ext.toUpperCase();

            if (null != DirectConversionFormat) {
                $("#btnConvert").attr("disabled", "disabled");

                //Adding supported formats into the list
                if (("PDFDOCX" == DirectConversionFormat) || ("PDFJPG300" == DirectConversionFormat) || ("PDFFB2" == DirectConversionFormat) || ("PDFLQ" == DirectConversionFormat)) {
                    if ("PDF" == upperExt) {
                        //Removing all items from the supported formats
                        $("#lbDest").empty();

                        if ("PDFDOCX" == DirectConversionFormat) {
                            $("#lbDest").append($("<option></option>").val("PDFDOCX").html("PDF в Word (DOCX)").attr("selected", "selected"));
                            $("#btnConvert").removeAttr("disabled");
                        }
                        else {
                            if ("PDFJPG300" == DirectConversionFormat) {
                                $("#lbDest").append($("<option></option>").val("PDFJPG300").html("PDF в JPG (хорошего качества 300dpi)").attr("selected", "selected"));
                                $("#btnConvert").removeAttr("disabled");
                            }
                            else {
                                if ("PDFFB2" == DirectConversionFormat) {
                                    $("#lbDest").append($("<option></option>").val("PDFFB2").html("PDF в FB2").attr("selected", "selected"));
                                    $("#btnConvert").removeAttr("disabled");
                                }
                                else {
                                    if ("PDFLQ" == DirectConversionFormat) {
                                        $("#lbDest").append($("<option></option>").val("PDFLQ").html("PDF в текст").attr("selected", "selected"));
                                        $("#btnConvert").removeAttr("disabled");
                                    }
                                }
                            }
                        }
                    }
                    else {
                        alert("Выберите PDF файл");
                    }
                }
                else {
                    if ("IPDF0" == DirectConversionFormat) {
                        if (("JPG" == upperExt) ||
                            ("JPEG" == upperExt) ||
                            ("JFIF" == upperExt) ||
                            ("PNG" == upperExt) ||
                            ("BMP" == upperExt) ||
                            ("GIF" == upperExt) ||
                            ("ICO" == upperExt) ||
                            ("TIF" == upperExt) ||
                            ("TIFF" == upperExt)) {

                            //Removing all items from the supported formats
                            $("#lbDest").empty();

                            $("#lbDest").append($("<option></option>").val("IPDF0").html("PDF без отступов (изображение масштабируется)").attr("selected", "selected"));
                            $("#btnConvert").removeAttr("disabled");
                        }
                        else {
                            alert("Выберите файл изображения");
                        }
                    }
                    else {
                        if (("WORDPDF100" == DirectConversionFormat) || ("WORDFB2" == DirectConversionFormat)) {
                            if (("DOC" == upperExt) || ("DOCX" == upperExt) || ("RTF" == upperExt)) {
                                //Removing all items from the supported formats
                                $("#lbDest").empty();

                                if ("WORDPDF100" == DirectConversionFormat) {
                                    $("#lbDest").append($("<option></option>").val("WORDPDF100").html("PDF со 100% форматированием").attr("selected", "selected"));
                                    $("#btnConvert").removeAttr("disabled");
                                }
                                else {
                                    if ("WORDFB2" == DirectConversionFormat) {
                                        $("#lbDest").append($("<option></option>").val("WORDFB2").html("FictionBook2 (FB2)").attr("selected", "selected"));
                                        $("#btnConvert").removeAttr("disabled");
                                    }
                                }
                            }
                            else {
                                alert("Выберите Word файл");
                            }
                        }
                        else {
                            if ("DJVU2PDF50" == DirectConversionFormat) {
                                if ("DJVU" == upperExt) {
                                    //Removing all items from the supported formats
                                    $("#lbDest").empty();

                                    $("#lbDest").append($("<option></option>").val("DJVU2PDF50").html("PDF (хорошего качества)").attr("selected", "selected"));
                                    $("#btnConvert").removeAttr("disabled");
                                }
                                else {
                                    alert("Выберите DJVU файл");
                                }
                            }
                            else {
                                if (("FB2TXT" == DirectConversionFormat) || ("FB2PDF" == DirectConversionFormat) || ("FB2WORD" == DirectConversionFormat)) {
                                    if ("FB2" == upperExt) {
                                        //Removing all items from the supported formats
                                        $("#lbDest").empty();

                                        if ("FB2TXT" == DirectConversionFormat) {
                                            $("#lbDest").append($("<option></option>").val("FB2TXT").html("Text").attr("selected", "selected"));
                                            $("#btnConvert").removeAttr("disabled");
                                        }
                                        else {
                                            if ("FB2PDF" == DirectConversionFormat) {
                                                $("#lbDest").append($("<option></option>").val("FB2PDF").html("PDF").attr("selected", "selected"));
                                                $("#btnConvert").removeAttr("disabled");
                                            }
                                            else {
                                                if ("FB2WORD" == DirectConversionFormat) {
                                                    $("#lbDest").append($("<option></option>").val("FB2WORD").html("MS Word (DOC)").attr("selected", "selected"));
                                                    $("#btnConvert").removeAttr("disabled");
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        alert("Выберите FB2 файл");
                                    }
                                }
                                else {
                                    if (("TXTFB2" == DirectConversionFormat) || ("TXTPDF" == DirectConversionFormat) || ("TXTWORD" == DirectConversionFormat)) {
                                        if ("TXT" == upperExt) {
                                            //Removing all items from the supported formats
                                            $("#lbDest").empty();

                                            if ("TXTFB2" == DirectConversionFormat) {
                                                $("#lbDest").append($("<option></option>").val("TXTFB2").html("FictionBook2 (FB2)").attr("selected", "selected"));
                                                $("#btnConvert").removeAttr("disabled");
                                            }
                                            else {
                                                if ("TXTPDF" == DirectConversionFormat) {
                                                    $("#lbDest").append($("<option></option>").val("TXTPDF").html("PDF").attr("selected", "selected"));
                                                    $("#btnConvert").removeAttr("disabled");
                                                }
                                                else {
                                                    if ("TXTWORD" == DirectConversionFormat) {
                                                        $("#lbDest").append($("<option></option>").val("TXTWORD").html("MS Word (DOC)").attr("selected", "selected"));
                                                        $("#btnConvert").removeAttr("disabled");
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            alert("Выберите текстовый файл");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                DirectConversionFormat = null;
            }
            else {
                //Adding supported formats into the list
                if ("PDF" == upperExt) {
                    //Removing all items from the supported formats
                    $("#lbDest").empty();

                    $("#lbDest").append($("<option></option>").val("PDFHQ").html("PDF в текст (для PDF высокого качества)").attr("selected", "selected"));
                    $("#lbDest").append($("<option></option>").val("PDFMQ").html("PDF в текст (для PDF хорошего качества)"));
                    $("#lbDest").append($("<option></option>").val("PDFLQ").html("PDF в текст (для PDF низкого качества)"));
                    $("#lbDest").append($("<option></option>").val("PDFWORD").html("PDF в Word (DOC)"));
                    $("#lbDest").append($("<option></option>").val("PDFDOCX").html("PDF в Word (DOCX)"));
                    $("#lbDest").append($("<option></option>").val("PDFRTF").html("PDF в RTF"));
                    $("#lbDest").append($("<option></option>").val("PDFEPUB").html("PDF в EPUB"));
                    $("#lbDest").append($("<option></option>").val("PDFFB2").html("PDF в FB2"));
                    $("#lbDest").append($("<option></option>").val("PDFJPG600").html("PDF в JPG (высокого качества 600dpi)"));
                    $("#lbDest").append($("<option></option>").val("PDFJPG300").html("PDF в JPG (хорошего качества 300dpi)"));
                    $("#lbDest").append($("<option></option>").val("PDFJPG100").html("PDF в JPG (низкого качества 100dpi)"));
                    $("#lbDest").append($("<option></option>").val("PDFIMGEXTRACT").html("Извлечь рисунки из PDF"));
                    $("#lbDest").append($("<option></option>").val("PDFSPLIT").html("Разделить PDF (1 страница в файле)"));
                    $("#lbDest").append($("<option></option>").val("PDFSPLIT10").html("Разделить PDF (10 страниц в файле)"));
                    $("#lbDest").append($("<option></option>").val("PDFSPLIT50").html("Разделить PDF (50 страниц в файле)"));
                    $("#lbDest").append($("<option></option>").val("PDFSPLIT100").html("Разделить PDF (100 страниц в файле)"));
                    $("#lbDest").append($("<option></option>").val("PDFSPLIT500").html("Разделить PDF (500 страниц в файле)"));
                    $("#lbDest").append($("<option></option>").val("PDFCOMPRESS").html("Сжать PDF"));
                }
                else {
                    if (("JPG" == upperExt) ||
                        ("JPEG" == upperExt) ||
                        ("JFIF" == upperExt) ||
                        ("PNG" == upperExt) ||
                        ("BMP" == upperExt) ||
                        ("GIF" == upperExt) ||
                        ("ICO" == upperExt) ||
                        ("TIF" == upperExt) ||
                        ("TIFF" == upperExt)) {
                        //Removing all items from the supported formats
                        $("#lbDest").empty();

                        $("#lbDest").append($("<option></option>").val("JPG").html("JPG изображение").attr("selected", "selected"));
                        $("#lbDest").append($("<option></option>").val("JPEG").html("JPEG изображение"));
                        $("#lbDest").append($("<option></option>").val("JFIF").html("JFIF изображение"));
                        $("#lbDest").append($("<option></option>").val("PNG").html("PNG изображение"));
                        $("#lbDest").append($("<option></option>").val("BMP").html("BMP изображение"));
                        $("#lbDest").append($("<option></option>").val("GIF").html("GIF изображение"));
                        $("#lbDest").append($("<option></option>").val("TIF").html("TIF изображение"));
                        $("#lbDest").append($("<option></option>").val("TIFF").html("TIFF изображение"));
                        $("#lbDest").append($("<option></option>").val("ICO16x16").html("ICO 16x16"));
                        $("#lbDest").append($("<option></option>").val("ICO32x32").html("ICO 32x32"));

                        if (("JPG" == upperExt) ||
                            ("JPEG" == upperExt) ||
                            ("JFIF" == upperExt) ||
                            ("PNG" == upperExt) ||
                            ("BMP" == upperExt) ||
                            ("GIF" == upperExt) ||
                            ("TIF" == upperExt)) {
                            $("#lbDest").append($("<option></option>").val("IPDF0").html("PDF без отступов (изображение масштабируется)"));
                            $("#lbDest").append($("<option></option>").val("IPDF00").html("PDF без отступов (изображение НЕ масштабируется)"));
                            $("#lbDest").append($("<option></option>").val("IPDF1").html("PDF с отступом 1cm (изображение масштабируется)"));
                            $("#lbDest").append($("<option></option>").val("IPDF10").html("PDF с отступом 1cm (изображение НЕ масштабируется)"));
                            $("#lbDest").append($("<option></option>").val("IPDF2").html("PDF с отступом 2cm (изображение масштабируется)"));
                            $("#lbDest").append($("<option></option>").val("IPDF20").html("PDF с отступом 2cm (изображение НЕ масштабируется)"));
                        }

                        if ("TIFF" == upperExt) {
                            $("#lbDest").append($("<option></option>").val("IPDF0").html("PDF без отступов (изображение масштабируется)"));
                        }
                    }
                    else {
                        if (("HTM" == upperExt) || ("HTML" == upperExt)) {
                            //Removing all items from the supported formats
                            $("#lbDest").empty();

                            $("#lbDest").append($("<option></option>").val("HTMTXT").html("Text").attr("selected", "selected"));
                            if (("HTM" == upperExt) || ("HTML" == upperExt)) {
                                $("#lbDest").append($("<option></option>").val("HTMFB2").html("FictionBook2 (FB2)"));
                                $("#lbDest").append($("<option></option>").val("HTMEPUB").html("EPUB"));
                                $("#lbDest").append($("<option></option>").val("HTMDOCX").html("MS Word (DOCX)"));
                            }
                        }
                        else {
                            if ("FB2" == upperExt) {
                                //Removing all items from the supported formats
                                $("#lbDest").empty();

                                $("#lbDest").append($("<option></option>").val("FB2TXT").html("Text").attr("selected", "selected"));
                                $("#lbDest").append($("<option></option>").val("FB2PDF").html("PDF"));
                                $("#lbDest").append($("<option></option>").val("FB2WORD").html("MS Word (DOC)"));
                                $("#lbDest").append($("<option></option>").val("FB2DOCX").html("MS Word (DOCX)"));
                                $("#lbDest").append($("<option></option>").val("FB2RTF").html("RTF"));
                                $("#lbDest").append($("<option></option>").val("FB2EPUB").html("EPUB"));
                            }
                            else {
                                if ("TXT" == upperExt) {
                                    //Removing all items from the supported formats
                                    $("#lbDest").empty();

                                    $("#lbDest").append($("<option></option>").val("TXTPDF").html("PDF").attr("selected", "selected"));
                                    $("#lbDest").append($("<option></option>").val("TXTFB2").html("FictionBook2 (FB2)"));
                                    $("#lbDest").append($("<option></option>").val("TXTEPUB").html("EPUB"));
                                    $("#lbDest").append($("<option></option>").val("TXTWORD").html("MS Word (DOC)"));
                                    $("#lbDest").append($("<option></option>").val("TXTDOCX").html("MS Word (DOCX)"));
                                    $("#lbDest").append($("<option></option>").val("TXTRTF").html("RTF"));
                                }
                                else {
                                    if (("DOC" == upperExt) || ("DOCX" == upperExt) || ("RTF" == upperExt)) {
                                        //Removing all items from the supported formats
                                        $("#lbDest").empty();

                                        $("#lbDest").append($("<option></option>").val("WORDTXT").html("Text").attr("selected", "selected"));
                                        $("#lbDest").append($("<option></option>").val("WORDFB2").html("FictionBook2 (FB2)"));
                                        $("#lbDest").append($("<option></option>").val("WORDPDF").html("PDF (только текст без форматирования)"));
                                        $("#lbDest").append($("<option></option>").val("WORDPDF100").html("PDF со 100% форматированием"));
                                    }
                                    else {
                                        if ("EPUB" == upperExt) {
                                            //Removing all items from the supported formats
                                            $("#lbDest").empty();

                                            $("#lbDest").append($("<option></option>").val("EPUBWORD").html("MS Word (DOC)").attr("selected", "selected"));
                                            $("#lbDest").append($("<option></option>").val("EPUBDOCX").html("MS Word (DOCX)"));
                                            $("#lbDest").append($("<option></option>").val("EPUBRTF").html("RTF"));
                                            $("#lbDest").append($("<option></option>").val("EPUBFB2").html("FB2"));
                                        }
                                        else {
                                            if ("DJVU" == upperExt) {
                                                //Removing all items from the supported formats
                                                $("#lbDest").empty();

                                                $("#lbDest").append($("<option></option>").val("DJVU2PDF150").html("PDF (самого высокого качества)").attr("selected", "selected"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2PDF80").html("PDF (высокого качества)"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2PDF50").html("PDF (хорошего качества)"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2PDF25").html("PDF (низкого качества)"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2TIFF150").html("TIFF (самого высокого качества)"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2TIFF80").html("TIFF (высокого качества)"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2TIFF50").html("TIFF (хорошего качества)"));
                                                $("#lbDest").append($("<option></option>").val("DJVU2TIFF25").html("TIFF (низкого качества)"));
                                            }
                                            else {
                                                if ("ZIP" == upperExt) {
                                                    //Removing all items from the supported formats
                                                    $("#lbDest").empty();

                                                    $("#lbDest").append($("<option></option>").val("PDFMERGE").html("Объединить несколько PDF файлов в один").attr("selected", "selected"));
                                                    $("#lbDest").append($("<option></option>").val("PDFIMAGEMERGE").html("Объединить несколько изображений в один PDF"));
                                                }
                                                else {
                                                    //Removing all items from the supported formats
                                                    $("#lbDest").empty();
                                                    $("#btnConvert").attr("disabled", "disabled");
                                                    alert(upperExt + " файлы не поддерживаются");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            //Removing all items from the supported formats
            $("#lbDest").empty();
            $("#btnConvert").attr("disabled", "disabled");
            alert("Добавьте расширение к Вашему файлу");
        }
    }
    else {
        //Removing all items from the supported formats
        $("#lbDest").empty();
        $("#btnConvert").attr("disabled", "disabled");
        alert("Добавьте расширение к Вашему файлу");
    }
}

let SupportedFormatsFileValid = false;
function CheckSupportedFormatsFile(sender, args) {
    let upperExt;
    if ((null != args.Value) && ("" != args.Value)) {
        let parts = args.Value.split(".");

        if (1 < parts.length) {
            //Getting file"s extension
            let ext = parts[parts.length - 1];
            if ((null != ext) && ("" != ext)) {
                //Checking allowed extensions
                upperExt = ext.toUpperCase();

                args.IsValid = ("JPG" == upperExt) ||
                    ("JPEG" == upperExt) ||
                    ("JFIF" == upperExt) ||
                    ("PNG" == upperExt) ||
                    ("BMP" == upperExt) ||
                    ("GIF" == upperExt) ||
                    ("ICO" == upperExt) ||
                    ("TIF" == upperExt) ||
                    ("TIFF" == upperExt) ||

                    ("HTM" == upperExt) ||
                    ("HTML" == upperExt) ||
                    ("FB2" == upperExt) ||
                    ("EPUB" == upperExt) ||

                    ("TXT" == upperExt) ||

                    ("DOC" == upperExt) ||
                    ("DOCX" == upperExt) ||
                    ("RTF" == upperExt) ||

                    ("PDF" == upperExt) ||

                    ("DJVU" == upperExt) ||

                    ("ZIP" == upperExt);;
            }
            else {
                //Extension is empty
                args.IsValid = true;
            }
        }
        else {
            //There is no extension
            args.IsValid = true;
        }
    }
    else {
        //There is no file extension
        args.IsValid = false;
    }

    SupportedFormatsFileValid = args.IsValid;

    if (SupportedFormatsFileValid) {
        //Enabling convert button
        $("#btnConvert").removeAttr("disabled");
    }
    /*
     else {
     if ("" != upperExt) {
     alert(upperExt + " files are not supported");
     }
     else {
     alert("Your file does not have an extension");
     }
     }
     */
}

let DirectConversionFormat = null;
function directConvert(format) {
    DirectConversionFormat = format;

    //Openning file selector
    document.getElementById($("[type="file"]")[0].id).click();
}