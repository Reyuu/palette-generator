my_colors = [];
generated_colors = [];
steps = 4;
end_color = "#000000";
end_colors = [];
padding_start = 1;
padding_end = 0;
gamma = 1;
saturation = 1;
saturation_enabled = false;
separate_end_colors = false;

//update colors
function update_colors(){
    $("#colors").html("");
    generated_colors = [];
    for (i = 0; i < my_colors.length; i++){
        c = my_colors[i];
        if (saturation_enabled) {
            c = chroma(c).saturate(saturation);
        }
        if (separate_end_colors) {
            cs = chroma.scale([c, end_colors[i]])
        } else {
            cs = chroma.scale([c, end_color]);
        }
        cs = cs.padding([1 - padding_start, padding_end]).gamma(gamma).mode($("#interpolation").val()).colors(steps);
        generated_colors.push(cs);
        new_color_div = $("<div class=\"centerer-items color_row\" id=\"color" + i + "\"></div>");
        for (j = 0; j < steps; j++){
            new_color_div.append("<div class=\"color_square\" style=\"background-color: " + cs[j] +"\"></div>");
        }
        //new_color_div.append("<input type=\"button\" value=\"-\" data-index=" + i + "></input>");
        btn = $("<input class=\"delete_button\" type=\"button\" value=\"-\" id=\"delete" + i + "\"></input>");
        btn.on("click", function () {
            index = parseInt(this.id.replace("delete", ""))
            my_colors.splice(index, 1);
            end_colors.splice(index, 1);
            update_colors();
        });
        new_color_div.append(btn);
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

function dataURLtoFile(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

function generate_png() {
    canvas = $("<canvas></canvas");
    canvas[0].width = 16 * steps;
    canvas[0].height = 16 * generated_colors.length;
    context = canvas[0].getContext("2d");
    for (i = 0; i < generated_colors.length; i++) {
        for (j = 0; j < generated_colors[i].length; j++) {
            context.fillStyle = generated_colors[i][j];
            context.strokeStyle = generated_colors[i][j];
            context.fillRect(16 * j, 16 * i, 16 * (j + 1), 16 * (i + 1));
            context.stroke();
        }
    }
    canvas_val = canvas[0].toDataURL();
    return canvas_val
}

//handle events
$(function(){
    update_colors();
    $("#color_picker_add").css("background-color", "#000000");
    $("#color_picker_end").css("background-color", "#000000");
    $("#steps_label").text(steps);
    $("#padding_start_label").text(padding_start);
    $("#padding_end_label").text(padding_end);
    $("#gamma_label").text(gamma);
    $("#saturation_label").text(gamma);

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
        end_colors.push($("#end_color").val())
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
    $("#download_palette_png").on("click", function () {
        blob = dataURLtoFile(generate_png())
        saveAs(blob, "palette.png");
    });
    $("#add_color").on("change", function(){
        this.parentNode.style.backgroundColor = this.value;
    });
    $("#end_color").on("change", function () {
        this.parentNode.style.backgroundColor = this.value;
    });
    $("#gamma_slider").on("input", function () {
        gamma = $("#gamma_slider").val();
        $("#gamma_label").text(gamma);
        update_colors();
    });
    $("#saturation_slider").on("input", function () {
        gamma = $("#saturation_slider").val();
        $("#saturation_label").text(gamma);
        update_colors();
    });
    $("#saturation_checkbox").on("change", function () {
        saturation_enabled = $("#saturation_checkbox").prop('checked');
        if (saturation_enabled) {
            $("#saturation_slider").prop('disabled', false);
        } else {
            $("#saturation_slider").prop('disabled', true);
        }
        update_colors();
    });
    $("#separate_colors_checkbox").on("change", function () {
        separate_end_colors = $("#separate_colors_checkbox").prop('checked');
        update_colors();
    });
});
