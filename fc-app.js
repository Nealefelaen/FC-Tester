var FCs = [];
var any_fcs = [];
var randomnumber = -1;
var startTime;
var show_each_times = 2;
var show_each_times_backup;
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
var mode = 1;

var paul_submode = 1;
var paul_0 = false;
var paul_1 = false;
var paul_2 = false;
var paul_3 = false;
var paul_4 = false;
var paul_5 = false;
var paul_6 = false;
var paul_7 = false;
var paul_8 = false;
var paul_9 = false;
var paul_J = false;
var paul_Q = false;
var paul_K = false;
var suit_size = 1;

var fc_table_rows = 10;
var fc_table_columns = 2;
var fc_table_submode = 1;
var table_fc_size = 40;

var timeout_var;

document.onkeypress = checkKeycode;

function sortfunction(a, b)
{
    return (b.average_time_taken - a.average_time_taken);
}

function write_statistics()
{
    test_div_div.style.display = 'none';
    if(mode != 2) test_div.innerHTML = '--';
    else if(paul_submode == 1) test_div.innerHTML = '--';
    else
    {
        var temp_text_holder = "<center><div style='background: white; width: ";
        if(suit_size==1) temp_text_holder+=300+"px; height: 100px;";
        else temp_text_holder+=750+"px; height: 250px;";
        temp_text_holder += "'></div></center>";
        $('#test').html(temp_text_holder);
    }

    var temptext;
    var total_total_time = 0;
    var max_time = 0;
    var fc_max_time;
    var min_time = 100000;
    var fc_min_time;
    var overall_average_time;
    var more_than_2s = 0;
    var between_1s_2s = 0;
    var less_than_1s = 0;

    for(var i=0; i < number_of_FCs; i++)
    {
        var total_time = 0;
        for(var j=0; j < FCs[i].number_of_times; j++)
        {
            total_time += FCs[i].time_taken[j];
            if(FCs[i].time_taken[j] >= max_time)
            {
                max_time = FCs[i].time_taken[j];
                fc_max_time = FCs[i];
            }
            if(FCs[i].time_taken[j] <= min_time)
            {
                min_time = FCs[i].time_taken[j];
                fc_min_time = FCs[i];
            }
        }
        FCs[i].average_time_taken = total_time / FCs[i].number_of_times;
        if(FCs[i].average_time_taken >= 2000)
        {
            more_than_2s++;
        }
        else if(FCs[i].average_time_taken >= 1000)
        { 
            between_1s_2s++;
        }
        else less_than_1s++;
        total_total_time += total_time;
    }
    overall_average_time = Math.round(total_total_time / (fcs_shown));
    FCs.sort(sortfunction);
    started = 0;
    if(mode == 2) 
    {
        temptext = "";
    }
    else
    {
        var total_total_time_mins = Math.round(total_total_time/(60*100))/10;
        temptext = "<div id='concise_results'>FC Test, "+start_fc+"-"+end_fc+" ("+FCs.length+" FCs) x "+show_each_times+" ("+number_of_FCs*show_each_times+" FCs total) - "+total_total_time_mins;
        if(total_total_time_mins == 1) temptext += " minute";
        else temptext += " minutes";
        temptext += "<br />-- Average Time: "+overall_average_time+"ms<br />";
        if(less_than_1s>=1) temptext += "-- "+less_than_1s+"/"+FCs.length+" recalled in less than 1 second (average)<br />"
        if(between_1s_2s>=1) temptext += "-- "+between_1s_2s+"/"+FCs.length+" recalled between 1 second and 2 seconds (average)<br />"
        if(more_than_2s>=1) temptext += "-- "+more_than_2s+"/"+FCs.length+" recalled after more than 2 seconds (average)<br />"
        temptext += "-- Minimum recall time: "+min_time+"ms ("+fc_min_time.fc+")<br />-- Maximum recall time: "+max_time+"ms ("+fc_max_time.fc+")<br /></div><br />";
    }
    temptext += "<audio id='sound' preload='auto' autobuffer><source src='bell.ogg' /><source src='bell.mp3' /></audio>";
    temptext += "<table><tr><td>FC</td>";
    var test1 = 1;
    for(var j = 1; j <= show_each_times; j++)
    {
        temptext += "<td>Time " + j + "</td>";
    }
    temptext += "<td>Average Time</td><td>Review Time (seconds)</td><td>Review<a onclick='show_review_help();'>(?)</a></td></tr>";
    for(var i = 0; i < number_of_FCs; i++)
    {
        if(FCs[i].number_of_times > 0)
        {
            if(mode == 2 && paul_submode == 2 && suit_size == 2)
            {
                FCs[i].fc=FCs[i].fc.replace(/_2/g, "_1");
                FCs[i].fc=FCs[i].fc.replace(/750/, "300");
                FCs[i].fc=FCs[i].fc.replace(/250/, "100");
            }
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
            temptext += "<td>" + Math.round(FCs[i].average_time_taken) + "ms</td>";
            if(Math.round(FCs[i].average_time_taken) > 2000) temptext += "<td><input type='text' style='width: 5em;' value='120' /></td><td><button onclick=\"review('"+FCs[i].fc+"', $(this).parent().prev().children()[0].value); $(this).css('background', '#888'); $(this).html('Reviewed');\">Review</button></td>";
            else if(Math.round(FCs[i].average_time_taken) > 1000) temptext += "<td><input type='text' style='width: 5em;' value='60' /></td><td><button onclick=\"review('"+FCs[i].fc+"', $(this).parent().prev().children()[0].value); $(this).css('background', '#888'); $(this).html('Reviewed');\">Review</button></td>";
            else if(Math.round(FCs[i].average_time_taken) > 500) temptext += "<td><input type='text' style='width: 5em;' value='30' /></td><td><button onclick=\"review('"+FCs[i].fc+"', $(this).parent().prev().children()[0].value); $(this).css('background', '#888'); $(this).html('Reviewed');\">Review</button></td>";
            else temptext += "<td><input type='text' style='width: 5em;' value='0' /></td><td><button onclick=\"review('"+FCs[i].fc+"', $(this).parent().prev().children()[0].value); $(this).css('background', '#888'); $(this).html('Reviewed');\">Review</button></td>";
            temptext += "</tr>";
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

function show_review_help()
{
    var temptext = "<div id='show_review_help' onclick='$(this).remove()'><p>Reviewing an FC</p><p>For FCs that take you longer than two seconds to recognise it is recommended that you review the FC for two minutes using the <a href='http://www.pmemory.com/student-area/GMS_Manual/Inner_Speech_and_Inner_Drawing_Techniques.htm'>Inner Drawing technique</a>. FCs that take between one and two seconds to recognise should get one minute of review.</p><p>Input the time (in seconds) to review an FC and then press the 'Review' button. The FC will be shown and after the set time has passed it will turn red, and on supported browsers a sound will play <a onclick='document.getElementById(\"sound\").play()'>(Click here to test the sound)</a>.</p><p>(click anywhere on this message to close this message)</p></div>";
    
    $('body').append(temptext);
}

function review(review_fc, time)
{
    var temptext = "<button onclick=\"$('#result').toggle(); clearTimeout(timeout_var); $('#test_div').toggle(); $('#test').css('color', '');\">Done</button>";
    $("#result").toggle();
    $("#button_holder").html(temptext);
    $("#test").html(review_fc);
    $("#test_div").toggle();
    timeout_var = setTimeout("review_ended()", time*1000);
}

function review_ended()
{
    $("#test").css('color', 'red');
    document.getElementById("sound").play();
}

function page_setup()
{
    read_cookies();

    var temptext;
    temptext="<option ";
    if(mode == 1) temptext+="selected='selected'";
    temptext+="' value='1'>Digits</option>";
    temptext+="<option ";
    if(mode == 3) temptext+="selected='selected'";
    temptext+="' value='3'>FC Table Generator</option>";
    temptext+="<option ";
    if(mode == 4) temptext+="selected='selected'";
    temptext+="' value='4'>Any FC Mode</option>";
    temptext+="<option ";
    if(mode == 2) temptext+="selected='selected'";
    temptext+="' value='2'>Paul's Mode</option>";
    $('#mode_select').html(temptext);

    test_div = document.getElementById("test");
    test_div.style.fontSize='200';
    test_div_div = document.getElementById("test_div");
    mode_change();
}

function mode_change()
{
    mode=parseInt(mode);
    var temptext;
    switch(mode)
    {
        case 1:
            temptext="<p>It's pretty simple to use, change the settings below to the values you want and then press the 'Next' button. When you're ready to go press the 'Go!' button, the 'Next' button will be ready under your cursor. After you've started, press the 'Next' button once you recall the FCs image, the time it took you to recall it will be recorded and the next FC will be shown. After all of the FCs have been shown the number of times set below you will be taken to a statistics page that will show your results.<br /> Good Luck!</p>";
            temptext+="<div id='settings'>";
            temptext+="  <label for='start_fc' title='First number in the range of FCs to show'>Start FC: </label>";
            temptext+="  <input name='start_fc' id='start_fc' type='text' value='"+start_fc+"' />";
            temptext+="  <br />";
            temptext+="  <label for='end_fc' title='Last number in the range of FCs to show'>End FC: </label>";
            temptext+="  <input name='end_fc' id='end_fc' type='text' value='"+end_fc+"' />";
            temptext+="  <br />";
            temptext+="  <label for='show_each_times' title='Number of times to show each FC'>Number of times to show: </label>";
            temptext+="  <input name='show_each_times' id='show_each_times' type='text' value='"+show_each_times+"' />";
            temptext+="  <br />";
            temptext+="  <label title='Show which FCs?'>Show: </label>";
            temptext+="  <select class='input' id='fc_length'>";
            temptext+="    <option ";
            if(fc_length == 2) temptext+="selected='selected'";
            temptext+=" value='2'>Two Digit FCs</option>";
            temptext+="    <option ";
            if(fc_length == 3) temptext+="selected='selected'";
            temptext+=" value='3'>Three Digit FCs</option>";
            temptext+="  </select>";
            temptext+="  <br />";
            temptext+="  <label title='Increase/Decrease the size of the FC font'>Size of FC font: </label>";
            temptext+="  <button onclick='changeSize(10)'>+</button>";
            temptext+="  <button onclick='changeSize(-10);'>-</button>";
            temptext+="  <br />";
            temptext+="  <button id='next_button' onclick='settings_setup(); write_cookies(); tester_unsetup(); started=1; $(\"#start\").toggle(); $(\"#test_div\").toggle();' style='margin-top: 5px;'>Next</button>";
            temptext+="</div>";
            temptext+="<span title='Example FC Size' id='test_example'>00</span>";
            break;
        case 2:
            temptext="<p>You want a description of Paul's Mode? So do I =)</p>";
            temptext+="<div id='settings'>";
            temptext+="  <label for='paul_submode' title='Select a submode to test'>Sub-mode: </label>"
            temptext+="  <select class='input' id='paul_submode' onchange='paul_submode=this.options[this.selectedIndex].value; mode_change();'>";
            temptext+="    <option ";
            if(paul_submode == 1) temptext+="selected='selected'";
            temptext+=" value='1'>Face Value FCs</option>";
            temptext+="    <option ";
            if(paul_submode == 2) temptext+="selected='selected'";
            temptext+=" value='2'>Suits</option>";
            temptext+="  </select><br />";
            temptext+="  <br />";
            if(paul_submode == 1)
            {
                temptext+="  <div style='float: left;'><label style='height: 5em;' for='suit_selection' title='Select the value of the first card'>First card value: </label>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_0'";
                if(paul_0 != 'false') temptext+=" checked='true'";
                temptext+=">0</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_1'";
                if(paul_1 != 'false') temptext+=" checked='true'";
                temptext+=">1</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_2'";
                if(paul_2 != 'false') temptext+=" checked='true'";
                temptext+=">2</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_3'";
                if(paul_3 != 'false') temptext+=" checked='true'";
                temptext+=">3</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_4'";
                if(paul_4 != 'false') temptext+=" checked='true'";
                temptext+=">4</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_5'";
                if(paul_5 != 'false') temptext+=" checked='true'";
                temptext+=">5</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_6'";
                if(paul_6 != 'false') temptext+=" checked='true'";
                temptext+=">6</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_7'";
                if(paul_7 != 'false') temptext+=" checked='true'";
                temptext+=">7</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_8'";
                if(paul_8 != 'false') temptext+=" checked='true'";
                temptext+=">8</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_9'";
                if(paul_9 != 'false') temptext+=" checked='true'";
                temptext+=">9</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_J'";
                if(paul_J != 'false') temptext+=" checked='true'";
                temptext+=">J</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_Q'";
                if(paul_Q != 'false') temptext+=" checked='true'";
                temptext+=">Q</span>";
                temptext+="  <span class='paul'><input class='paul' type='checkbox' id='paul_K'";
                if(paul_K != 'false') temptext+=" checked='true'";
                temptext+=">K</span>";
                temptext+="  <br /></div>";
            }
            temptext+="  <label title='Increase/Decrease the size of the FC'>Size of FC: </label>";
            temptext+="  <button onclick='changeSize(10)'>+</button>";
            temptext+="  <button onclick='changeSize(-10);'>-</button>";
            temptext+="  <br />";
            temptext+="  <button id='next_button' onclick='settings_setup(); write_cookies(); tester_unsetup(); started=1; $(\"#start\").toggle(); $(\"#test_div\").toggle();' style='margin-top: 5px;'>Next</button>";
            temptext+="</div><br />";
            temptext+="<span title='Example FC Size' id='test_example'>";
            if(paul_submode==1) temptext+="QQQ";
            else
            {
                temptext+="<center><div style='width: ";
                if(suit_size==1) temptext+=300;
                else temptext+=750;
                temptext+="px'><span class='paul_suit_"+suit_size+" paul_suit_diamond_"+suit_size+"'></span><span class='paul_suit_"+suit_size+" paul_suit_spade_"+suit_size+"'></span><span class='paul_suit_"+suit_size+" paul_suit_club_"+suit_size+"'></span></div></center>";
            }
            temptext+="</span>";
            break;
        case 3:
            temptext="<p>This is a simple mode that generates a table of FCs.<br />Mode requested by kcharr12.</p>";
            temptext+="<div id='settings'>";
            temptext+="  <label for='fc_table_submode' title='Select a submode for the table'>Sub-mode: </label>"
            temptext+="  <select class='input' id='fc_table_submode' onchange='fc_table_submode=this.options[this.selectedIndex].value; mode_change();'>";
            temptext+="    <option ";
            if(fc_table_submode == 1) temptext+="selected='selected'";
            temptext+=" value='1'>Repeat numbers</option>";
            temptext+="    <option ";
            if(fc_table_submode == 2) temptext+="selected='selected'";
            temptext+=" value='2'>Don't repeat numbers</option>";
            temptext+="  </select><br />";
            temptext+="  <br />";
            temptext+="  <label for='start_fc' title='First number in the range of FCs'>Start FC: </label>";
            temptext+="  <input name='start_fc' id='start_fc' type='text' value='"+start_fc+"' />";
            temptext+="  <br />";
            temptext+="  <label for='end_fc' title='Last number in the range of FCs'>End FC: </label>";
            temptext+="  <input name='end_fc' id='end_fc' type='text' value='"+end_fc+"' />";
            temptext+="  <br />";
            temptext+="  <label for='fc_table_rows' title='Number of rows to show'>Rows: </label>";
            temptext+="  <input name='fc_table_rows' id='fc_table_rows' type='text' value='"+fc_table_rows+"' />";
            temptext+="  <br />";
            if(fc_table_submode == 1)
            {
                temptext+="  <label for='fc_table_columns' title='Number of rows to show'>Columns: </label>";
                temptext+="  <input name='fc_table_columns' id='fc_table_columns' type='text' value='"+fc_table_columns+"' />";
                temptext+="  <br />";
            }
            temptext+="  <label title='Show which FCs?'>Show: </label>";
            temptext+="  <select class='input' id='fc_length'>";
            temptext+="    <option ";
            if(fc_length == 2) temptext+="selected='selected'";
            temptext+=" value='2'>Two Digit FCs</option>";
            temptext+="    <option ";
            if(fc_length == 3) temptext+="selected='selected'";
            temptext+=" value='3'>Three Digit FCs</option>";
            temptext+="  </select>";
            temptext+="  <br />";
            temptext+="  <label title='Increase/Decrease the size of the FC font'>Size of FC font: </label>";
            temptext+="  <button onclick='changeSize(10);'>+</button>";
            temptext+="  <button onclick='changeSize(-10);'>-</button>";
            temptext+="  <br />";
            temptext+="  <button id='next_button' onclick='settings_setup(); write_cookies(); fc_table_setup();' style='margin-top: 5px;'>Regenerate Table</button>";
            temptext+="</div><br />";
            temptext+="<center><span id='test_example'></span></center>";
            break;
        case 4:
            temptext="<p>This is a hacked together mode that allows you to put in any FC and have it tested.<br />Mode requested again by Sp00k after the project was abandoned.</p>";
            temptext+="<div id='settings'>";
            temptext+="  <label for='show_each_times' title='Number of times to show each FC'>Number of times to show: </label>";
            temptext+="  <input name='show_each_times' id='show_each_times' type='text' value='"+show_each_times+"' />";
            temptext+="  <br />";
            temptext+="  <label title='Increase/Decrease the size of the FC font'>Size of FC font: </label>";
            temptext+="  <button onclick='changeSize(10)'>+</button>";
            temptext+="  <button onclick='changeSize(-10);'>-</button>";
            temptext+="  <br />";
            temptext+="  <label for='FCs' title='List of FCs to show'>FCs: </label>";
            temptext+="  <div id='any_fcs_holder'>";
            if(any_fcs.length > 0)
            {
                for(i=0; i<any_fcs.length; i++)
                {
                    temptext+="  <label> </label>  <input class='fcs' type='text' value='"+any_fcs[i]+"' />";
                }
            }
            else temptext+="  <label> </label>  <input class='fcs' type='text' value='' />";
            temptext+="  </div>";
            temptext+="  <br />";
            temptext+="  <label> </label><button onclick='add_any_fc()'>Add FC slot</button>";
            temptext+="  <button onclick='any_fcs = []; mode_change()'>Clear FC slots</button>";
            temptext+="  <br />";
            temptext+="  <button id='next_button' onclick='settings_setup(); write_cookies(); tester_unsetup(); started=1; $(\"#start\").toggle(); $(\"#test_div\").toggle();' style='margin-top: 5px;'>Next</button>";
            temptext+="</div>";
            temptext+="<span title='Example FC Size' id='test_example'>00</span>";
            break;
    }
    $('#introduction').html(temptext);
    switch(mode)
    {
        case 4:
        case 1:
            $('#test_example').css("font-size", fc_size);
            break;
        case 2:
            $('#test_example').css("font-size", fc_size);
            break;
        case 3:
            fc_table_setup();
            $('.test_example').css("font-size", table_fc_size);
            break;
    }
}

function fc_table_setup()
{
    var temptext;
    temptext="<table>";
    var x=start_fc;
    FCs = [];
    
    number_of_FCs=end_fc-(start_fc-1);
    for(var i=0; i<number_of_FCs; i++)
    {
        var temp_text_holder = x + '';
        while(temp_text_holder.length < fc_length)
        {
            temp_text_holder = "0" + temp_text_holder;
        }
        FCs[i]=temp_text_holder;
        x++;
    }

    if(fc_table_submode == 1)//repeats
    {
        for(var i=0; i<fc_table_columns; i++)
        {
            temptext+="<tr>"
            for(var j=0; j<fc_table_rows; j++)
            {
                random_number=Math.floor(Math.random()*(number_of_FCs));
                temptext+="<td class='test_example' style='padding: 10px;'>"+FCs[random_number]+"</td>";
            }
            temptext+=("</tr>");
        }
    }
    else//no repeats
    {
        var numbers_done = 0;
        for(var i=0; i<(number_of_FCs/fc_table_rows); i++)
        {
            temptext+="<tr>"
            for(var j=0; j<fc_table_rows; j++)
            {
                if((number_of_FCs-numbers_done)==0) break;
                random_number=Math.floor(Math.random()*(number_of_FCs-numbers_done));
                temptext+="<td class='test_example' style='padding: 10px;'>"+FCs[random_number]+"</td>";
                FCs.splice(random_number, 1);
                numbers_done++;
            }
            temptext+=("</tr>");
        }

    }
    $('#test_example').html(temptext);
    $('.test_example').css("font-size", table_fc_size);
}

function write_cookies()
{
    var date = new Date();
    date.setTime(date.getTime()+(5*365*24*60*60*1000)); // Keep cookie for 5 years
    var expires = "; expires="+date.toGMTString();

    if(mode == 2)
    {
        show_each_times = show_each_times_backup;
    }

    document.cookie = "mode="+mode+expires+"; path=/";
    switch(mode)
    {
        case 1:
            document.cookie = "start_fc="+start_fc+expires+"; path=/";
            document.cookie = "end_fc="+end_fc+expires+"; path=/";
            document.cookie = "show_each_times="+show_each_times+expires+"; path=/";
            document.cookie = "fc_length="+fc_length+expires+"; path=/";
            document.cookie = "fc_size="+fc_size+expires+"; path=/";
            break;
        case 2:
            document.cookie = "paul_submode="+paul_submode+expires+"; path=/";
            document.cookie = "paul_0="+paul_0+expires+"; path=/";
            document.cookie = "paul_1="+paul_1+expires+"; path=/";
            document.cookie = "paul_2="+paul_2+expires+"; path=/";
            document.cookie = "paul_3="+paul_3+expires+"; path=/";
            document.cookie = "paul_4="+paul_4+expires+"; path=/";
            document.cookie = "paul_5="+paul_5+expires+"; path=/";
            document.cookie = "paul_6="+paul_6+expires+"; path=/";
            document.cookie = "paul_7="+paul_7+expires+"; path=/";
            document.cookie = "paul_8="+paul_8+expires+"; path=/";
            document.cookie = "paul_9="+paul_9+expires+"; path=/";
            document.cookie = "paul_J="+paul_J+expires+"; path=/";
            document.cookie = "paul_Q="+paul_Q+expires+"; path=/";
            document.cookie = "paul_K="+paul_K+expires+"; path=/";
            document.cookie = "suit_size="+suit_size+expires+"; path=/";
            break;
        case 3:
            document.cookie = "fc_table_submode="+fc_table_submode+expires+"; path=/";
            document.cookie = "start_fc="+start_fc+expires+"; path=/";
            document.cookie = "end_fc="+end_fc+expires+"; path=/";
            document.cookie = "fc_table_rows="+fc_table_rows+expires+"; path=/";
            document.cookie = "fc_table_columns="+fc_table_columns+expires+"; path=/";
            document.cookie = "fc_length="+fc_length+expires+"; path=/";
            document.cookie = "table_fc_size="+table_fc_size+expires+"; path=/";
            break;
        case 4:
            var any_fc_holder = any_fcs[0];
            for(i=1; i<any_fcs.length; i++)
            {
                any_fc_holder += ":sep:"+any_fcs[i];
            }
            document.cookie = "any_fcs="+any_fc_holder+expires+"; path=/";
            break;
    }
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

function read_cookies()
{
    if(readCookie('mode')) mode = readCookie('mode');
    if(readCookie('start_fc')) start_fc = readCookie('start_fc');
    if(readCookie('end_fc')) end_fc = readCookie('end_fc');
    if(readCookie('show_each_times')) show_each_times = readCookie('show_each_times');
    if(readCookie('fc_length')) fc_length = readCookie('fc_length');
    if(readCookie('fc_size')) fc_size = readCookie('fc_size');

    if(readCookie('paul_submode')) paul_submode = readCookie('paul_submode');
    if(readCookie('paul_0')) paul_0 = readCookie('paul_0');
    if(readCookie('paul_1')) paul_1 = readCookie('paul_1');
    if(readCookie('paul_2')) paul_2 = readCookie('paul_2');
    if(readCookie('paul_3')) paul_3 = readCookie('paul_3');
    if(readCookie('paul_4')) paul_4 = readCookie('paul_4');
    if(readCookie('paul_5')) paul_5 = readCookie('paul_5');
    if(readCookie('paul_6')) paul_6 = readCookie('paul_6');
    if(readCookie('paul_7')) paul_7 = readCookie('paul_7');
    if(readCookie('paul_8')) paul_8 = readCookie('paul_8');
    if(readCookie('paul_9')) paul_9 = readCookie('paul_9');
    if(readCookie('paul_J')) paul_J = readCookie('paul_J');
    if(readCookie('paul_Q')) paul_Q = readCookie('paul_Q');
    if(readCookie('paul_K')) paul_K = readCookie('paul_K');
    if(readCookie('suit_size')) suit_size = parseInt(readCookie('suit_size'));

    if(readCookie('fc_table_submode')) fc_table_submode = readCookie('fc_table_submode');
    if(readCookie('fc_table_rows')) fc_table_rows = readCookie('fc_table_rows');
    if(readCookie('fc_table_columns')) fc_table_columns = readCookie('fc_table_columns');
    if(readCookie('table_fc_size')) table_fc_size = readCookie('table_fc_size');

    if(readCookie('any_fcs'))
    {
        var any_fc_holder;
        any_fc_holder = readCookie('any_fcs');
        any_fcs = any_fc_holder.split(':sep:');
    }
    
}

function tester_setup()
{
    var temptext;
    temptext = "<button onclick='write_statistics();'>Pause</button><button onclick='tester();'>Next</button>";
    document.getElementById("button_holder").innerHTML = temptext;
    startTime = new Date().getTime();
    randomnumber = -1;
    last_randomnumber = -1;
    tester();
}

function tester_unsetup()
{
    temptext = "<button onclick='write_statistics();'>Pause</button><button onclick='tester_setup();'>Go!</button>";
    document.getElementById("button_holder").innerHTML = temptext;
    $('#test').html('--');
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
    switch(mode)
    {
        case 1:
            start_fc = document.getElementById("start_fc").value
            end_fc = document.getElementById("end_fc").value
            show_each_times = document.getElementById("show_each_times").value
            var fc_length_input = document.getElementById("fc_length");
            fc_length = fc_length_input.options[fc_length_input.selectedIndex].value;
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
            break;
        case 2:
            if(paul_submode == 1)
            {
                paul_0=document.getElementById('paul_0').checked;
                paul_1=document.getElementById('paul_1').checked;
                paul_2=document.getElementById('paul_2').checked;
                paul_3=document.getElementById('paul_3').checked;
                paul_4=document.getElementById('paul_4').checked;
                paul_5=document.getElementById('paul_5').checked;
                paul_6=document.getElementById('paul_6').checked;
                paul_7=document.getElementById('paul_7').checked;
                paul_8=document.getElementById('paul_8').checked;
                paul_9=document.getElementById('paul_9').checked;
                paul_J=document.getElementById('paul_J').checked;
                paul_Q=document.getElementById('paul_Q').checked;
                paul_K=document.getElementById('paul_K').checked;

                var card_options = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K'];
                var first_card_value;
                var temp_text_holder = '';
                var k = 0;
                var go_through = false;

                for(var l=0; l<13; l++)
                {
                    go_through=false;
                    switch(l)
                    {
                        case 0:
                            if(paul_0) go_through=true;
                            break;
                        case 1:
                            if(paul_1) go_through=true;
                            break;
                        case 2:
                            if(paul_2) go_through=true;
                            break;
                        case 3:
                            if(paul_3) go_through=true;
                            break;
                        case 4:
                            if(paul_4) go_through=true;
                            break;
                        case 5:
                            if(paul_5) go_through=true;
                            break;
                        case 6:
                            if(paul_6) go_through=true;
                            break;
                        case 7:
                            if(paul_7) go_through=true;
                            break;
                        case 8:
                            if(paul_8) go_through=true;
                            break;
                        case 9:
                            if(paul_9) go_through=true;
                            break;
                        case 10:
                            if(paul_J) go_through=true;
                            break;
                        case 11:
                            if(paul_Q) go_through=true;
                            break;
                        case 12:
                            if(paul_K) go_through=true;
                            break;
                    }

                    if(go_through)
                    {
                        first_card_value = card_options[l];

                        for(var i=0; i<card_options.length; i++)
                        {
                            for(var j=0; j<card_options.length; j++)
                            {
                                temp_text_holder = ''+first_card_value+''+card_options[i]+''+card_options[j];
                                FCs[k] = {fc: temp_text_holder, number_of_times: 0, time_taken: [0], average_time_taken: 0, total_time_taken: 0};
                                k++;
                            }
                        }
                    }
                }
            }
            else
            {
                FCs = [];
                var temp_text_holder;
                var l=0;
                var suit1;
                var suit2;
                var suit3;
                var diamond = "<span class='paul_suit_"+suit_size+" paul_suit_diamond_"+suit_size+"'></span>";
                var spade = "<span class='paul_suit_"+suit_size+" paul_suit_spade_"+suit_size+"'></span>";
                var club = "<span class='paul_suit_"+suit_size+" paul_suit_club_"+suit_size+"'></span>";
                var heart = "<span class='paul_suit_"+suit_size+" paul_suit_heart_"+suit_size+"'></span>";

                for(var i=0; i<4; i++)
                {
                    switch(i)
                    {
                        case 0:
                            suit1=diamond;
                            break;
                        case 1:
                            suit1=spade;
                            break;
                        case 2:
                            suit1=club;
                            break;
                        case 3:
                            suit1=heart;
                            break;
                    }
                    for(var j=0; j<4; j++)
                    {
                        switch(j)
                        {
                            case 0:
                                suit2=diamond;
                                break;
                            case 1:
                                suit2=spade;
                                break;
                            case 2:
                                suit2=club;
                                break;
                            case 3:
                                suit2=heart;
                                break;
                        }
                        for(var k=0; k<4; k++)
                        {
                            switch(k)
                            {
                                case 0:
                                    suit3=diamond;
                                    break;
                                case 1:
                                    suit3=spade;
                                    break;
                                case 2:
                                    suit3=club;
                                    break;
                                case 3:
                                    suit3=heart;
                                    break;
                            }
                            temp_text_holder = "<center><div style='width: ";
                            if(suit_size==1) temp_text_holder+=300+"px; height: 100px;";
                            else temp_text_holder+=750+"px; height: 250px;";
                            temp_text_holder += "'> " + suit1 + suit2 + suit3 + "</div></center>";
                            FCs[l] = {fc: temp_text_holder, number_of_times: 0, time_taken: [0], average_time_taken: 0, total_time_taken: 0};
                            l++;
                        }
                    }
                }
                var temp_text_holder = "<center><div style='background: white; width: ";
                if(suit_size==1) temp_text_holder+=300+"px; height: 100px;";
                else temp_text_holder+=750+"px; height: 250px;";
                temp_text_holder += "'></div></center>";
                $('#test').html(temp_text_holder);
            }
            number_of_FCs=FCs.length;
            fcs_to_show = number_of_FCs;
            break;
        case 3:
            start_fc = document.getElementById("start_fc").value
            end_fc = document.getElementById("end_fc").value
            fc_table_submode = document.getElementById("fc_table_submode").value
            fc_table_rows = document.getElementById("fc_table_rows").value
            if(fc_table_submode == 1)
            {
                fc_table_columns = document.getElementById("fc_table_columns").value
            }
            var fc_length_input = document.getElementById("fc_length");
            fc_length = fc_length_input.options[fc_length_input.selectedIndex].value;
            break;
        case 4:
            show_each_times = document.getElementById("show_each_times").value
            fcs_shown = 0;
            var fc_counter = 0;
            $("#any_fcs_holder input").each(function (i) {
                if($(this).val() != "")
                {
                    any_fcs[fc_counter] = $(this).val();
//                    FCs[index].fc = $(this).val();
                    FCs[fc_counter] = {fc: $(this).val(), number_of_times: 0, time_taken: [0], average_time_taken: 0, total_time_taken: 0};
                    fc_counter++;
                }
            })
            number_of_FCs = FCs.length;
            fcs_to_show = number_of_FCs*show_each_times;
            break;
    }
}
function add_any_fc()
{
    $("#any_fcs_holder").append("<label> </label>  <input class='fcs' type='text' value='' />");
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
        if(mode == 2)
        {
            show_each_times_backup = show_each_times;
            show_each_times = 1;
        }
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
}

function changeSize(size) {
    switch(mode)
    {
        case 4:
        case 1:
            fc_size=parseInt(fc_size);
            fc_size += size;
            $('#test_example').css('font-size', fc_size);
            break;
        case 2:
            if(paul_submode == 1)
            {
                fc_size=parseInt(fc_size);
                fc_size += size;
                $('#test_example').css('font-size', fc_size);
            }
            else
            {
                if(size<0) suit_size=1;
                else suit_size=2;
                mode_change();
            }
            break;
        case 3:
            table_fc_size=parseInt(table_fc_size);
            table_fc_size+=size;
            $('.test_example').css('font-size', table_fc_size);
            break;
    }
}
