const Pontica = {
    BOVehicleModification: function BOVehicleModification() {
        const rowVehicleType = document.getElementsByClassName("row-type")[0];
        const img = rowVehicleType.getElementsByTagName("img")[0];
        img.style.width = "50px";
        img.style.height = "50px";
        const imgParent = img.parentNode;
        imgParent.style.display = "flex";
        imgParent.style.alignItems = "center";
        const paragraph = document.createElement("p");
        paragraph.style.marginBottom = "-3px";
        paragraph.style.marginLeft = "3px";
        paragraph.style.width = "50%";
        paragraph.style.display = "inline-block";

        if(img.src === "https://backoffice.internal.stuart.com/assets/ic_marker_bike-e0b02ac69ce8020cfa02e31cf9954fdb5d304d009ba0de2d1a268716cfd68519.png") {
            paragraph.innerHTML = "Bike";
            imgParent.appendChild(paragraph);
        }

        if(img.src === "https://backoffice.internal.stuart.com/assets/ic_marker_motorbike-0044facd69a2d45b675726b7e6e069fd2badba6e2a05842dbc4bf957d6caed8c.png") {
            paragraph.innerHTML = "Motorbike";
            imgParent.appendChild(paragraph);
        }

        if(img.src === "https://backoffice.internal.stuart.com/assets/ic_marker_car-7a8d8d68ce6bdad7a16dd2dd70876ced3327656418b34e0765b907c2e8beee66.png") {
            paragraph.innerHTML = "Car";
            imgParent.appendChild(paragraph);
        }
    }
}