var unique_username_timer = null;
var username_exists = false;
var ucase = new RegExp("[A-Z]+");
var lcase = new RegExp("[a-z]+");
var num = new RegExp("[0-9]+");
var vusername = new RegExp("^[^\-]?[a-zA-Z_0-9]+"); // do not allow a username to precede with one or more of `-`

var g_calling_timer = false;

$(document).ready(function() {

    $('#submit_forgot_signup').prop('disabled', true); // reset/enable page

    $("input[id=new_username]").keyup(function () {
        $('#submit_forgot_signup').prop('disabled', true); // reset/enable page
        if (g_calling_timer == false)
        {
            console.log('calling unique_username_rest');
            g_calling_timer = true;
            unique_username_timer = setTimeout(function() { unique_username_rest($("#new_username").val()); }, 2000);
            $("span[id*=unique_username_api_value]").hide();
        }

    });

    $("input[type=password]").keyup(function () {
        update_ui();
    });
});

function unique_username_rest(username)
{
    clearTimeout(unique_username_timer);
    g_calling_timer = false;

    console.log("unique_username_rest: " + username);
    if (username.length > 0)
    {

        var formData = JSON.stringify({
                    username: username,
                    });
        $.ajax({
            type: "POST",   
                url: APP_URL + "/api/v1/" + username + "/usernameexists",
                data: formData,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data, textStatus, jqXHR)
            {
                var exists;
//                console.log("usernameexists success: " + data);

                for(key in data) {
                    exists = data[key]['exists'];
                    console.log("value: " + data[key]['exists']);

    //                $('#view_api_key_button').hide();
                    var unique_username_result;
                    if (exists == true)
                    {
                        unique_username_result = 'This username is currently in use.'
                        username_exists = true;
                    }
                    else
                    {
                        unique_username_result = 'This username is available.'
                        username_exists = false;
                    }

                    $("span[id*=unique_username_api_value]").text(unique_username_result);
                    $("span[id*=unique_username_api_value]").show();

                    update_ui();

                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                var message;
                console.log("usernameexists fail");
            }
            });

    }
}

function update_ui()
{
    var long_password   = $("#password1").val().length >= 8;
    var uppercase       = ucase.test($("#password1").val());
    var lowercase       = lcase.test($("#password1").val());
    var numeric         = num.test($("#password1").val());
    var password_match  = ($("#password1").val() == $("#password2").val()) & long_password;

    var pwnotmatchuname =  ($("#password1").val() == $("#password2").val()) & ($("#password1").val() != $("#new_username").val());

    if (long_password)
    {
        $("#8char").removeClass("glyphicon-remove");
        $("#8char").addClass("glyphicon-ok");
        $("#8char").css("color", "#00A41E");
    }
    else
    {
        $("#8char").removeClass("glyphicon-ok");
        $("#8char").addClass("glyphicon-remove");
        $("#8char").css("color", "#FF0004");
    }

    if (uppercase)
    {
        $("#ucase").removeClass("glyphicon-remove");
        $("#ucase").addClass("glyphicon-ok");
        $("#ucase").css("color", "#00A41E");
    }
    else
    {
        $("#ucase").removeClass("glyphicon-ok");
        $("#ucase").addClass("glyphicon-remove");
        $("#ucase").css("color", "#FF0004");
    }

    if (lowercase)
    {
        $("#lcase").removeClass("glyphicon-remove");
        $("#lcase").addClass("glyphicon-ok");
        $("#lcase").css("color", "#00A41E");
    }
    else
    {
        $("#lcase").removeClass("glyphicon-ok");
        $("#lcase").addClass("glyphicon-remove");
        $("#lcase").css("color", "#FF0004");
    }

    if (numeric)
    {
        $("#num").removeClass("glyphicon-remove");
        $("#num").addClass("glyphicon-ok");
        $("#num").css("color", "#00A41E");
    }
    else
    {
        $("#num").removeClass("glyphicon-ok");
        $("#num").addClass("glyphicon-remove");
        $("#num").css("color", "#FF0004");
    }

    if (password_match)
    {
        $("#pwmatch").removeClass("glyphicon-remove");
        $("#pwmatch").addClass("glyphicon-ok");
        $("#pwmatch").css("color", "#00A41E");
    }
    else
    {
        $("#pwmatch").removeClass("glyphicon-ok");
        $("#pwmatch").addClass("glyphicon-remove");
        $("#pwmatch").css("color", "#FF0004");
    }

    if (pwnotmatchuname)
    {
        $("#pwnotmatchuname").removeClass("glyphicon-remove");
        $("#pwnotmatchuname").addClass("glyphicon-ok");
        $("#pwnotmatchuname").css("color", "#00A41E");
    }
    else
    {
        $("#pwnotmatchuname").removeClass("glyphicon-ok");
        $("#pwnotmatchuname").addClass("glyphicon-remove");
        $("#pwnotmatchuname").css("color", "#FF0004");
    }
     var passwords_valid = long_password && lowercase && uppercase && numeric && password_match && pwnotmatchuname;
    var valid_username  =  vusername.test($("#new_username").val());

    var username_ok = valid_username && !username_exists;
    var password_ok = long_password;

    if (username_ok)
    {
        $("#vusername").removeClass("glyphicon-remove");
        $("#vusername").addClass("glyphicon-ok");
        $("#vusername").css("color", "#00A41E");
    }
    else
    {
        $("#vusername").removeClass("glyphicon-ok");
        $("#vusername").addClass("glyphicon-remove");
        $("#vusername").css("color", "#FF0004");
    }

    console.log('------');
    $('#submit_forgot_signup').prop('disabled', (!passwords_valid || !username_ok)); // reset/enable page

}