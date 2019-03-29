var MongoClient = require('mongodb').MongoClient;
var ejs = require('ejs');
var Path = require('path');
var $ = require('jquery');
var url = "mongodb://localhost:27017/";
var kiranaStore = null;
function setValueKiranaStore(st){
    kiranaStore = st;
}
//var url = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb"

$(document).ready(function(){

    $('#aibtn').click(function(){
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('#table').hide();
        $('#additems').show('slow');
    });

    $('#sid').click(function(){
        $('.nav-link').removeClass('active');
        $('#additems').hide('slow');
        $(this).addClass('active');
        MongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if (err) throw err;
            let dbc = db.db('kirana');
            dbc.collection('Items').find({kiranastoreId:kiranaStore._id}).toArray(function(err1,result){
                if (err1) throw err1;
                db.close();
                let path = Path.join(__dirname,"../sellitem.ejs");
                console.log(path);
                ejs.renderFile(path,{items:result},function(err3,str){
                    if(err3) throw err3;
                    $('#table').html(str).show('slow');
                });
            });
        });
    });
    
    $('#sel').click(function(){
        if(kiranaStore==null){
            $('#itemform').hide(function(){
                $('#logform').show('slow');        
            });
        }else{
           let item = {
               kiranastoreId :kiranaStore._id,
               name: $('#ain').val(),
               price :$('#aip').val(),
               quantity :$('#aiq').val(),
               description : $('#aid').val(),
               date: new Date().toLocaleString()
           }
           MongoClient.connect(url,{useNewUrlParser:true},function(err,db){
               if (err) throw err;
               let dbc = db.db("kirana");
               dbc.collection('Items').insertOne(item,function(err,result){
                if (err){
                    $('#msg').html("Error in adding item").slideDown(1000).slideUp("slow",function(){
                        $('#additems input').val('');
                    });
                }else{
                    $('#msg').html("Item is added").slideDown(1000).slideUp("slow",function(){
                        $('#additems input').val('');
                    });
                }
                db.close();
               });
           });
        }
    });

    $('#Login').click(function(){
        let user = {
            email : $('#email').val(),
            password : $('#pass').val()
        }
        MongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err) throw err;
            let dbc = db.db('kirana');
            dbc.collection('Stores').findOne(user,function(err,docs){
                if(docs===null){
                    $('#msg').html("Either e-mail or password is wrong").slideDown(1000).slideUp("slow",function(){
                        $('form input').val("");
                        $('form select').val("select");
                    });
                }else{
                    $('#logform').hide("slow",function(){
                        $('#itemform').show('slow');
                    });
                    setValueKiranaStore(docs);
                }
                db.close();
            });
        });
    });

    $('#lgfosh').click(function(){
        $('#rform').hide(function(){
            $('#logform').slideDown();
        });
    });

    $('#rgfosh').click(function(){
        $('#logform').hide(function(){
            $('#rform').slideDown();
        });
    });


    $('#Register').click(function(){
        let store = {
            storename : $('#storename').val(),
            password : $('#rpass').val(),
            email : $('#remail').val(),
            address : {
                address : $('#address').val(),
                state : $('#state').val(),
                city: $('#city').val(),
                pincode : $('#pincode').val()
            }   
        };
        MongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            if(err){
                console.log(err);
            }else{
                var dbc = db.db('kirana');
                dbc.collection('Stores').insertOne(store,function(err1,result){
                    if(err1){
                        if(err1.code=11000){
                            $('#msg').html("Account already registered").slideDown(1000).slideUp("slow",function(){
                                $('form input').val("");
                                $('form select').val("select");
                            });
                        }else{
                            alert("Iternal Error");
                        }
                    }else{
                        $('#msg').html("Account Successfully Created").slideDown(1000).slideUp("slow",function(){
                            $('form input').val("");
                            $('form select').val("select");
                           $("#rform").slideUp("slow",function(){
                            $('#logform').slideDown();
                           });
                        });
                    }
                    db.close();
                });
            }
        });
    });

    $('#state').change(function(){
        MongoClient.connect(url,{useNewUrlParser:true},function(err,db){
            var dbc = db.db('kirana');
            dbc.collection('States').find({state:$('#state').val()}).toArray(function(err1,result){
                if(err1){ 
                    console.log(err1);
                }else {
                    var opt = $('#city').children().get(0);
                    $('#city').html('').append(opt);
                    for(let city of result){
                        for(let dist of city.districts){
                            $('<option>').text(dist).val(dist).appendTo('#city');
                        }
                    }
                }
                db.close();
            });
        });
    });

    ///###############################
    MongoClient.connect(url,{ useNewUrlParser: true },function(err,db){
        if(err) throw err;
        var dbc = db.db('kirana');
        dbc.collection('States').find({}).toArray(function(err1,result){
            if (err1) throw err1;
            for(let st of  result){
                $('<option>').val(st.state).text(st.state).appendTo('#state');
            }
            states = result;
            db.close();
        });
    });
    ///#####################3333
});