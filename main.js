my_colors = [];
generated_colors = [];
steps = 4;
end_color = "#000000";
padding_start = 1;
padding_end = 0;

//update colors
function update_colors(){
    $("#colors").html("");
    generated_colors = [];
    for (i = 0; i < my_colors.length; i++){
        c = my_colors[i];
        cs = chroma.scale([c, end_color]);
        cs = cs.padding([1-padding_start, padding_end]).mode($("#interpolation").val()).colors(steps);
        generated_colors.push(cs);
        new_color_div = $("<div class=\"color_row\" id=\"color" + i + "\"></div>");
        for (j = 0; j < steps; j++){
            new_color_div.append("<div class=\"color_square\" style=\"background-color: " + cs[j] +"\"></div>");
        }
        $("#colors").append(new_color_div);
    }
}

function generate_gpl(){
    buffer = "GIMP Palette\r\n";
    buffer += "#Palette Name: " + $("#palette_name").val() + "\r\n";
    buffer += "#Description: \r\n";
    buffer += "#Colors: " + my_colors.length*steps + "\r\n";
    for (i = 0; i < generated_colors.length; i++){
        for (j = 0; j < generated_colors[i].length; j++){
            color = generated_colors[i][j];
            buffer += chroma(color).rgb().join("\t");
            buffer += "\t" + color.replace("#", "") + "\r\n";
        }
    }
    return buffer
}

//handle events
$(function(){
    update_colors();
    $("#color_picker_add").css("background-color", "#000000");
    $("#color_picker_end").css("background-color", "#000000");
    $("#steps_label").text(steps);
    $("#padding_start_label").text(padding_start);
    $("#padding_end_label").text(padding_end);

    $("#end_color").on("change", function(){
        end_color = $("#end_color").val();
        update_colors();
    });
    $("#interpolation").on("change", function(){
        update_colors();
    });
    $("#steps_slider").on("input", function(){
        steps = $("#steps_slider").val();
        $("#steps_label").text(steps);
        update_colors();
    });
    $("#add_color_button").on("click", function () {
        my_colors.push($("#add_color").val());
        update_colors();
    });
    $('#padding_start').on("input", function(){
        padding_start = $('#padding_start').val();
        $("#padding_start_label").text(padding_start);
        update_colors();
    });
    $('#padding_end').on("input", function () {
        padding_end = $('#padding_end').val();
        $("#padding_end_label").text(padding_end);
        update_colors();
    });
    $("#download_palette").on("click", function(){
        blob = new Blob([generate_gpl()], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "palette.gpl");
    });
    $("#add_color").on("change", function(){
        this.parentNode.style.backgroundColor = this.value;
    });
    $("#end_color").on("change", function () {
        this.parentNode.style.backgroundColor = this.value;
    });
});
