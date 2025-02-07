const output_div = document.getElementById("output-certificate");
const output_elements = document.getElementsByClassName("output");
const styles = document.getElementById("styles");
const customOptions = document.getElementById("custom-options");
let light_theme = false;

// Clears output elements.
function clear() {
    customOptions.style.display = 'none';
    output_elements[0].innerText = "";
    document.getElementById("title").value = "";
    output_div.style.backgroundImage = ``;

    output_elements[0].innerText = "";
    output_elements[1].innerText = "";
    output_elements[2].innerText = "";
    output_elements[3].innerText = "";
}

// Checking for if the custom option is selected, and if it is we show the options.
styles.addEventListener("change", () => {
    // Going through the output elements and defaulting them to white.
    for (let e of output_elements) {
        e.style.color = "#FFFFFF";
    }

    // Shows the custom options
    if (styles.value == "custom") {
        customOptions.style.display = 'block';
        return;
    }
    clear();
})


// Certificate Class
// Holds important function for actually building the certificate.
class Certificate {
    constructor(theme, recipient, sender, date, title=null) {
        this.theme = theme;
        this.recipient = recipient;
        this.sender = sender;
        this.date = date;
        this.title = title;
    }

    /* 
        Actual build function. We have an image parameter that is defaulted to null
        so we can check if a custom certificate is being built. 
    */
    build(image = null) {
        // Actual custom certificate check.
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

        // Changing the text color to black if the certificate is white.
        if (light_theme) {
            for (let e of output_elements) {
                e.style.color = "#000000";
            }
        } else {
            for (let e of output_elements) {
                e.style.color = "#FFFFFF";
            }
        }

        // Setting each output element's text to the corresponding certificate data.
        output_elements[0].innerText = this.title;
        output_elements[1].innerText = this.recipient;
        output_elements[2].innerText = this.date;
        output_elements[3].innerText = this.sender;
    }
}

// This function returns the background image URL for the css if the option is not custom.
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

// Function triggered when the build certificate button is pressed.
function buildCustomCertificate() {
    // Pull all form data and store it in variables.
    let recipient = document.getElementById("recipient").value;
    let issuer = document.getElementById("issuer").value;
    let date = new Date();
    let out_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    let certificate = new Certificate(handleStyleBackground(styles.value), recipient, issuer, out_date, document.getElementById("title").value);

    // Checking if the recipient and issuer were not inputted. If they weren't, we dont continue to the build process.
    if (recipient == "" || issuer == "") {
        return;
    }

    // Checking if a background was selected in the custom option. If not, we alert the user and return out of the build sequence.
    if (styles.value == "custom" && !document.getElementById("custom-background").files[0]) {
        alert("Background must be specified for custom theme option.");
        return;
    }

    /* 
        Checking if a background was selected and if it was we pass the background
        image into the certificate build function and then reset the file input for the next certificate. 
    */
    if (document.getElementById("custom-background").files[0]) {
        certificate.build(document.getElementById("custom-background").files[0]);
        document.getElementById("custom-background").value = null;
        return;
    }

    // If everything is correct and the forms are correct, we finally build the certificate.
    certificate.build();
}