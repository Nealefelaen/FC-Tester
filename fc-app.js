var FCs = [];
var randomnumber = -1;
var startTime;
var show_each_times = 2;
var start_fc = 1;
var end_fc = 10;
var x = start_fc;
var number_of_FCs = (end_fc - start_fc) + 1;
var fcs_to_show = show_each_times * number_of_FCs;
var fcs_shown = 0;
var started = 0;
var rand_factor = 2;
var last_randomnumber = -1;
var l = 0;
var test_div;
var test_div_div;
var fc_length;
var fc_size = 200;

document.onkeypress = checkKeycode;

function sortfunction(a, b)
{
    return (b.average_time_taken - a.average_time_taken);
}

function write_statistics()
{
    test_div_div.style.display = 'none';
    test_div.innerHTML = '--';
    var temptext;
    for(var i=0; i < number_of_FCs; i++)
    {
        var total_time = 0;
        for(var j=0; j < FCs[i].number_of_times; j++)
        {
            total_time += FCs[i].time_taken[j];
        }
        FCs[i].average_time_taken = total_time / FCs[i].number_of_times;
    }
    FCs.sort(sortfunction);
    started = 0;
    temptext = "<table><tr><td>FC</td>";
    for(var j = 1; j <= show_each_times; j++)
    {
        temptext += "<td>Time " + j + "</td>";
    }
    temptext += "<td>Average Time</td></tr>";
    for(var i = 0; i < number_of_FCs; i++)
    {
        if(FCs[i].number_of_times > 0)
        {
            temptext += "<tr><td>" + FCs[i].fc + "</td>";
            var total_time = 0;
            for(var j = 0; j < show_each_times; j++)
            {
                if(j < FCs[i].number_of_times)
                {
                    temptext += "<td>" + FCs[i].time_taken[j] + "ms</td>";
                }
                else
                {
                    temptext += "<td>-</td>";
                }
            }
            temptext += "<td>" + Math.round(FCs[i].average_time_taken) + "ms</td></tr>";
        }
    }
    temptext += "</table>";
    if(fcs_shown < fcs_to_show)
    {
        temptext += '<button onclick="started=1; startTime = new Date().getTime(); document.getElementById(\'result\').innerHTML=\'\'; document.getElementById(\'test_div\').style.display=\'block\'; tester_unsetup();">Resume</button>'
    }
    temptext += '<button onclick="FCs = []; random_number=-1; settings_setup(); started=1; document.getElementById(\'result\').innerHTML=\'\'; document.getElementById(\'test_div\').style.display=\'block\'; tester_unsetup();">Go Again</button>'
    temptext += '<button onClick="FCs = []; random_number=-1; document.getElementById(\'result\').innerHTML=\'\'; document.getElementById(\'start\').style.display=\'block\'; tester_unsetup();">Settings</button>'
    document.getElementById("result").innerHTML = temptext;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function page_setup()
{
    if(readCookie("start_fc")) start_fc=readCookie("start_fc");
    if(readCookie("end_fc")) end_fc=readCookie("end_fc");
    if(readCookie("show_each_times")) show_each_times=readCookie("show_each_times");
    if(readCookie("fc_length")) fc_length=readCookie("fc_length");
    if(readCookie("fc_size")) fc_size=readCookie("fc_size");

    test_div = document.getElementById("test");
    test_div.style.fontSize=fc_size;
    test_example = document.getElementById("test_example");
    test_example.style.fontSize=fc_size;
    test_div_div = document.getElementById("test_div");
}

function tester_setup()
{
    var temptext;
    temptext = "<button onclick='write_statistics();'>Pause</button><button onclick='tester();'>Next</button>";
    document.getElementById("button_holder").innerHTML = temptext;
    startTime = new Date().getTime();
    tester();
}

function tester_unsetup()
{
    temptext = "<button onclick='write_statistics();'>Pause</button><button onclick='tester_setup();'>Go!</button>";
    document.getElementById("button_holder").innerHTML = temptext;
}

function checkKeycode(e)
{
    if (started)
    {
        var keycode;
        if (window.event) keycode = window.event.keyCode;
        else if (e) keycode = e.which;
        if(keycode == 32)
        {
            tester();
            //      document.getElementById("result").innerHTML += "pressed: "+ l + "<br />";
            //      l++;
        }
        //     else if(keycode == 27) write_statistics();
        //     else if(keycode == 0) write_statistics();
    }
}

function settings_setup()
{
    var date = new Date();
    date.setTime(date.getTime()+(5*365*24*60*60*1000)); // keep the cookie for 5 years
    var expires = "; expires="+date.toGMTString();

    document.cookie = "start_fc="+start_fc+expires+"; path=/";
    document.cookie = "end_fc="+end_fc+expires+"; path=/";
    document.cookie = "show_each_times="+show_each_times+expires+"; path=/";
    document.cookie = "fc_length="+fc_length+expires+"; path=/";
    document.cookie = "fc_size="+fc_size+expires+"; path=/";

    start_fc = document.getElementById("start_fc").value
    end_fc = document.getElementById("end_fc").value
    show_each_times = document.getElementById("show_each_times").value
    fc_length = document.getElementById("fc_length").selectedIndex+2 // This isn't the best way to do this, it's the neatest - we're ignoring the value of the selected item and going by where it is in the list
    fcs_shown = 0;
    test_div.style.fontSize=fc_size;

    number_of_FCs = (end_fc - start_fc) + 1;
    fcs_to_show = show_each_times * number_of_FCs;
    x = start_fc;

    for(var i=0; i<number_of_FCs; i++)
    {
        var temp_text_holder = x + '';
        while(temp_text_holder.length < fc_length)
        {
            temp_text_holder = "0" + temp_text_holder;
        }
        FCs[i] = {fc: temp_text_holder, number_of_times: 0, time_taken: [0], average_time_taken: 0, total_time_taken: 0};
        x++;
    }
    
}
function tester()
{
    if(randomnumber != -1)
    {
        var n = new Date();
        var s = n.getTime();
        var diff = s - startTime;
        if(diff > 100) // javascript can screw up sometimes and give a false time of less than 100ms (spamming a button is ~130ms)
        {
            FCs[randomnumber].time_taken[FCs[randomnumber].number_of_times-1] = diff;
            FCs[randomnumber].total_time_taken += diff;
            //      FCs[randomnumber].average_time_taken = FCs[randomnumber].total_time_taken / FCs[randomnumber].number_of_times;
        }
        else // in which case we want to re-show the number to get an accurate time for it
        {
            FCs[randomnumber].number_of_times--;
            fcs_shown--;
        }
        //     document.getElementById("result").innerHTML += FCs[randomnumber].number_of_times + '<br />';
        if(fcs_shown >= fcs_to_show)
        {
            write_statistics();
            return 0;
        }
    }
    var k = 0;
    var exit_loop = 0;
    var rand_attempts = 0;
    while(randomnumber == last_randomnumber)
    {
        randomnumber=Math.floor(Math.random()*(number_of_FCs));
        if(FCs[randomnumber].number_of_times >= show_each_times)
        {
            randomnumber=last_randomnumber;
        }
        if(rand_attempts > rand_factor)
        {
            for(var i = 0; i < number_of_FCs; i++)
            {
                if(FCs[i].number_of_times < show_each_times)
                {
                    if(i != last_randomnumber)
                    {
                        randomnumber = i;
                        exit_loop = 1;
                        break;
                    }
                    else
                    {
                        k = i;
                    }
                }
            }
            if(exit_loop)
            {
                break;
            }
            randomnumber = k;
            break
        }
        rand_attempts++;
    }
    last_randomnumber = randomnumber;
    FCs[randomnumber].number_of_times++;
    test_div.innerHTML = FCs[randomnumber].fc;
    startTime = new Date().getTime();
    fcs_shown++;
    //    document.getElementById("test").innerHTML += FCs[randomnumber].number_of_times;
    
    //    alert(randomnumber);
}

function changeSize(size) {
    fc_size += size;
    $('#test_example').css('font-size', fc_size);
    $('#test_div').css('font-size', fc_size);
}
