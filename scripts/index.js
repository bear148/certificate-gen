const output_div = document.getElementById("output-certificate");
const output_elements = document.getElementsByClassName("output");
const styles = document.getElementById("styles");
const customOptions = document.getElementById("custom-options");
let light_theme = false;

styles.addEventListener("change", () => {
    if (styles.value == "custom") {
        customOptions.style.display = 'block';
    }
})

class Certificate {
    constructor(theme, recipient, sender, date, title=null) {
        this.theme = theme;
        this.recipient = recipient;
        this.sender = sender;
        this.date = date;
        this.title = title;
    }

    build(image = null) {
        if(!image) {
            output_div.style.backgroundImage = this.theme;
        } else {
            let fr = new FileReader();
            fr.readAsDataURL(image);
            fr.onload = function() {
                output_div.style.backgroundImage = `url(${fr.result})`;
            }
        }

        console.log(`${this.theme} - ${this.date} | r: ${this.recipient} s: ${this.sender} | t: ${this.title}`);

        if (light_theme) {
            for (let e of output_elements) {
                e.style.color = "#000000";
            }
        } else {
            for (let e of output_elements) {
                e.style.color = "#FFFFFF";
            }
        }

        output_elements[0].innerText = this.title;
        output_elements[1].innerText = this.recipient;
        output_elements[2].innerText = this.date;
        output_elements[3].innerText = this.sender;
    }
}

function handleStyleBackground(style) {
    light_theme = false;

    switch(style) {
        case "basic":
            light_theme = true;
            return "url('/images/c1.png')";
        case "professional":
            return "url('/images/c2.png')";
        case "programming":
            return "url('/images/c3.png')";
        case "custom":
            return "custom background";
        default:
            return "n/a";
    }
}

function buildCustomCertificate() {
    let recipient = document.getElementById("recipient").value;
    let issuer = document.getElementById("issuer").value;
    let date = new Date();
    let out_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    let certificate = new Certificate(handleStyleBackground(styles.value), recipient, issuer, out_date, document.getElementById("title").value);

    if (recipient == "" || issuer == "") {
        return;
    }

    if (styles.value == "custom" && !document.getElementById("custom-background").files[0]) {
        alert("Background must be specified for custom theme option.");
        return;
    }

    if (document.getElementById("custom-background").files[0]) {
        certificate.build(document.getElementById("custom-background").files[0]);
        return;
    }

    certificate.build();
}