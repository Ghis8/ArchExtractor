"use strict"

$("#child2").hide();

var zip = new JSZip();
var files = []
var test = []
var contents = []
var f = []
var oneFile 
var urls = []

// read file



$("#file").bind("change dragleave", function(event) {
    function handleFile(f) {

        JSZip.loadAsync(f)                                  
            .then(function(zip) {

                oneFile = zip.files;

                zip.forEach(  function (relativePath, zipEntry) { 
                    
                    var y = zipEntry.name
                    test.push(y);
                    urls.push(zipEntry);
                    $("#child1").hide();
                    $("#child2").show();
                });
            }, function (e) {
                $result.append($("<div>", {
                    "class" : "alert alert-danger",
                    text : "Error reading " + f.name + ": " + e.message
                }));
            });
            
    }

    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }

    setTimeout(function () {
      tree()
    }, 1300);
});

// jstree view

function tree(){

    f = test.sort((a,b) => a.length - b.length);

    contents.push(
        {"id": `${f[0]}`, "parent": "#", "text": `${f[0]}`, "a_attr": {"href": "javascript.submitMe()"}}
    )

    for(let x = 1; x<=(f.length)-1; x++){

     contents.push({"id": `${f[x]}`, "parent": `${compare(x)}`, "text": `${compare1(x)}`,"a_attr": {"href": "javascript.submitMe()"}},)
    
    }
    createTree();

    setTimeout(function () {
        $("#tree").jstree("open_all");
    }, 1000);

    setTimeout(function () {
        console.log("click")
        clicked();
    }, 1000);
}

function compare(x){

    if(f[x].localeCompare(f[x].match(/(.*\/)/g))){
        return f[x].match(/(.*\/)/g)
    }else{
        return  f[x].match(/.+(?=.*\/.*\/)\//g)
    }

}

function compare1(x){

    if(f[x].match(/[^/]*$/g)== ''){
        return  f[x].match(/[^\/]*(?=\/[^\/]*$)/g)
    }else{
        return f[x].match(/[^/]*$/g)
    }

}

function createTree(){
    createJSTree(contents);
    
}

function createJSTree(contents) {          
    $('#tree').jstree({
        'core': {
            'data': contents
        },
        "plugins" : [ "themes", "html_data", "sort", "ui" ]
    });
    
}

// Unxip and Download

function submitMe(){ 
    var result = $('#tree').jstree('get_selected');
        console.log('result',result)

    for(let x = 0;x<result.length;x++){
    
        var  name = oneFile[`${result[x]}`]
        files.push(name)
    
    }
           
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
                    zip.file(f.name, f._data);
                 }
                 zip.generateAsync({type:"blob"}).then(function (blob) {
                    saveAs(blob, `${f.name}`)                          
                })

} 

function clicked(){
    
    $('a').click(function(){
        console.log('clicked')
        setTimeout(function () {
            console.log('submit')
            submitMe()
        }, 500);
    })

}


function downloadAll(){
    var bb = []
    console.log(urls)
    for(let x = 0;x<urls.length;x++){

        bb.push(urls[x]._data)

    }

    for(let x = 0; x<bb.length;x++){

        zip.file(urls[x].name, bb[x]);
        zip.generateAsync({type:"blob"}).then(function (blob) {
            saveAs(blob, `${urls[x].name}`)                          
        })
   
        }
        }

    function refresh(){
        location.reload();
    }