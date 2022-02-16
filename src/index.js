import jQuery from "../libs/jquery-3.6.0.min";
import dayjs from "../libs/dayjs.min.js";

window.$ = jQuery;
window.dayjs = dayjs;

const DEPARTMENTS = {
  CHATS: "CHATS",
  MA: "MA",
  ADMIN: "ADMIN",
};

/**
 * The order matters. In case a script is being added, add to the end.
 */
const scriptsInformation = [
  {
    title: "Enlarge BO Vehicle Type",
    description: "Enlarges the driver's vehicle in BackOffice",
    tags: [DEPARTMENTS.CHATS, DEPARTMENTS.ADMIN],
  },
  {
    title: "Intercom to BackOffice Sidebar Link",
    description: "The driver ID in Intercom sends you directly to the driver's profile in Back Office.",
    tags: [DEPARTMENTS.CHATS, DEPARTMENTS.ADMIN],
  },
  {
    title: "Manual Assignments BO Sidebar",
    description: "Makes sidebar wider, smarter(detects if Pending, and if driver was assigned) and sorts drivers by distance",
    tags: [DEPARTMENTS.MA],
  },
  {
    title: "Intercom to Slack Highlighting",
    description: "Highlights Intercom chats which have threads in Slack in custom colors. If no thread, colors in light green.",
    tags: [DEPARTMENTS.CHATS],
  },
  {
    title: "Back Office Filtering Packages",
    description: "Creates deeper filtering for Back Office packages.",
    tags: [DEPARTMENTS.CHATS],
  },
];

window.Pontica = {
  scriptsInformation,
  exec: function exec(chromeStorage) {
    chromeStorage.local.get(null, function (items) {
      const state = items.checkboxesState;

      if (!state)
        chromeStorage.local.set({
          checkboxesState: [].fill(false, 0, scriptsInformation.length),
        });

      if (
        window.location.href.includes(
          "https://backoffice.internal.stuart.com/admin/drivers"
        ) &&
        state[0]
      ) {
        BOVehicleModification();
      }
      
      if (
        window.location.href.includes("https://app.intercom.com/a/apps*") &&
        state[1]
      ) {
        IntercomToBO();
      }
      if (
        window.location.href.includes(
          "https://backoffice.internal.stuart.com/admin/packages"
        ) &&
        state[2]
      ) {
        MASidebarMod();
      }
      if (
        (window.location.href.includes("https://app.slack.com/client") ||
          window.location.href.includes("https://app.intercom.com/a/apps")) &&
        state[3]
      ) {
        IntercomSlackConnection(items, chromeStorage);
      }

      if (
        window.location.href.includes(
          "https://backoffice.internal.stuart.com/admin/packages"
        ) &&
        state[4]
      ) {
        BOFilterPackages();
      }
    });
  }
};

function BOVehicleModification() {
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

  if (
    img.src ===
    "https://backoffice.internal.stuart.com/assets/ic_marker_bike-e0b02ac69ce8020cfa02e31cf9954fdb5d304d009ba0de2d1a268716cfd68519.png"
  ) {
    paragraph.innerHTML = "Bike";
    imgParent.appendChild(paragraph);
  }

  if (
    img.src ===
    "https://backoffice.internal.stuart.com/assets/ic_marker_motorbike-0044facd69a2d45b675726b7e6e069fd2badba6e2a05842dbc4bf957d6caed8c.png"
  ) {
    paragraph.innerHTML = "Motorbike";
    imgParent.appendChild(paragraph);
  }

  if (
    img.src ===
    "https://backoffice.internal.stuart.com/assets/ic_marker_car-7a8d8d68ce6bdad7a16dd2dd70876ced3327656418b34e0765b907c2e8beee66.png"
  ) {
    paragraph.innerHTML = "Car";
    imgParent.appendChild(paragraph);
  }
}

function IntercomToBO() {
  let userInfoBox;
  
  setInterval(function(){
    userInfoBox = document.querySelectorAll('.ds-new__card')[0];
    if(userInfoBox) {
      const kvValue = userInfoBox.querySelectorAll('.kv__value')[0];
      const driverIdLink = kvValue.getElementsByTagName('a')[0];
      const driverId = driverIdLink.innerHTML;
      driverIdLink.href = "https://backoffice.internal.stuart.com/admin/drivers/" + driverId;
    }
  }, 3000)
}

function MASidebarMod() {
  setTimeout(() => main(), 200);
  
  function main() {
    const zone = document.querySelectorAll("[href*='/admin/zones/']")[0].innerHTML;
    const assignSidebar = document.getElementById('assign-a-driver_sidebar_section');
    sidebarHourToEnglishTime();
    
    if (!assignSidebar) {
      return;
    }
    
    const assignSidebarH3 = assignSidebar.getElementsByTagName('h3')[0];
    const privateReasonKeyClientRequest = document.getElementById('private_reason_key_no_supply');
    const panelContentsSmall = document.getElementsByClassName('panel_contents small')[0];
    const invitationsTable = document.getElementsByClassName('panel_contents')[5];
    const hasCurrentPending = invitationsTable.getElementsByClassName('status_tag pending').length > 0;
    const eligibleDriversTbody = document.querySelectorAll("table.eligible-drivers > tbody")[0];
    let newTbody = document.createElement('tbody');
    const xpath = "//h3[text()='Actions']";
    const assignHistoryHeader = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const opsActionsDiv = assignHistoryHeader.parentNode;
    const opsActionsTr = opsActionsDiv.getElementsByTagName('tr');
    const selfAssignedDriversLinks = document.getElementsByClassName('panel_contents')[0].querySelectorAll("[href*='/admin/drivers']");
    const selfAssignedDriversIds = [];
    
    for (let i = 0; i < selfAssignedDriversLinks.length; i++) {
      const currentDriverData = selfAssignedDriversLinks[i].href.split('/');
      const currentDriverId = currentDriverData[currentDriverData.length - 1];
      selfAssignedDriversIds.push(currentDriverId);
    }
    
    if (hasCurrentPending) {
      assignSidebar.innerHTML = '<h1>PENDING</h1>';
      return;
    }
    
    if (!hasAssigned(assignSidebar, panelContentsSmall)) {
      return;
    }
    
    if (zone === "London") {
      assignSidebarH3.style.color = "red";
      assignSidebarH3.style.fontSize = "20px";
      assignSidebarH3.innerHTML = "LONDON PACKAGE";
    }
    if (zone === "Leeds") {
      assignSidebarH3.style.color = "orange";
      assignSidebarH3.style.fontSize = "20px";
      assignSidebarH3.innerHTML = "LEEDS PACKAGE";
    }
    
    increaseWidth(assignSidebar, panelContentsSmall, privateReasonKeyClientRequest);
    
    let sortedDriverDistances = sortDriversByDistance(eligibleDriversTbody, newTbody);
    
    const assignedDrivers = getPrevAssignedDrivers(opsActionsDiv, opsActionsTr);
    
    sortedDriverDistances
        .forEach((dist, i) =>
            markIfAssigned(dist, i, assignedDrivers, newTbody, selfAssignedDriversIds));
  }
  
  function markIfAssigned(distance, index, assignedDrivers, newTbody, selfAssignedDriversIds) {
    const currentTd = newTbody.getElementsByTagName('tr')[index]?.querySelectorAll("td:nth-child(1)")[0];
    if (!currentTd) {
      return;
    }
    
    const currentDriverId = currentTd.innerHTML.split("<")[0];
    
    if (selfAssignedDriversIds.indexOf(currentDriverId) !== -1) {
      currentTd.innerHTML = 'System invited driver' + currentDriverId + 'already';
      return;
    }
    
    if (assignedDrivers.indexOf(currentDriverId) !== -1) {
      currentTd.innerHTML = 'Already assigned.' + currentDriverId;
    }
  }
  
  /**
   * Checks if the package has a driver assigned already
   * @param {HTMLElement} assignSidebar
   * @param {HTMLElement} panelContentsSmall
   * @returns {boolean} bool
   */
  function hasAssigned(assignSidebar, panelContentsSmall) {
    return assignSidebar !== undefined && panelContentsSmall !== undefined;
  }
  
  /**
   * Increase Sidebar Width
   * @param assignSidebar
   * @param {HTMLElement} panelContentsSmall
   * @param {HTMLElement} privateReasonKeyClientRequest
   */
  function increaseWidth(assignSidebar, panelContentsSmall, privateReasonKeyClientRequest) {
    assignSidebar.style.width = '500px';
    assignSidebar.style.marginLeft = '-210px';
    panelContentsSmall.style.maxWidth = '500px';
    privateReasonKeyClientRequest.click();
  }
  
  /**
   * Replaces the Driver's Table with a new Table, containing the drivers sorted in ascending order.
   * @param {HTMLElement} eligibleDriversTbody
   * @param {HTMLElement} newTbody
   * @returns {Array} sortedDriverDistances
   */
  function sortDriversByDistance(eligibleDriversTbody, newTbody) {
    if (eligibleDriversTbody) {
      let sortedDriverDistances = [];
      const eligibleDriversRows = eligibleDriversTbody.querySelectorAll('tr');
      const driverDistances = [];
      
      for (let i = 0; i < eligibleDriversRows.length; i++) {
        driverDistances.push(+eligibleDriversRows[i].querySelectorAll("td:nth-child(2)")[0].innerHTML.split(' ')[0]);
      }
      
      sortedDriverDistances = driverDistances.slice().sort((a, b) => a - b);
      
      for (let i = 0; i < sortedDriverDistances.length; i++) {
        const desiredValue = sortedDriverDistances[i];
        const indexInOldArr = driverDistances.indexOf(desiredValue);
        
        const newTableRow = eligibleDriversRows[indexInOldArr];
        newTbody.appendChild(newTableRow);
      }
      
      eligibleDriversTbody.parentNode.appendChild(newTbody);
      eligibleDriversTbody.parentNode.removeChild(eligibleDriversTbody);
      return sortedDriverDistances;
    }
  }
  
  /**
   * Checks which drivers have already been assigned manually.
   * @returns {Array<string>} result
   * @param opsActionsDiv
   * @param opsActionsTr
   */
  function getPrevAssignedDrivers(opsActionsDiv, opsActionsTr) {
    const result = [];
    
    for (let i = 1; i < opsActionsTr.length; i++) {
      const currentId = opsActionsTr[i].getElementsByTagName('td')[5]?.innerHTML?.split(" ")[3];
      const currentStatus = opsActionsTr[i].getElementsByTagName('td')[5]?.innerHTML?.split(" ")[0]?.trim();
      (currentId && currentStatus ==="Succeeded") ? result.push(currentId) : null;
    }
    
    return result;
  }
  
  function sidebarHourToEnglishTime() {
    const rowTiming = document.querySelectorAll(".row-timing")[0];
    let rowTimingTd = rowTiming.getElementsByTagName("td")[0];
    const date = rowTimingTd.innerHTML.split("/");
    const orderDay = date[0].substr(date[0].length - 2, date[0].length);
    const orderMonth = date[1];
    const orderYear = date[2].split("-")[0].trim();
    const orderDate = dayjs(orderYear + "-" + orderMonth + "-" + orderDay);
    const now = dayjs();
    
    if(now.isBefore(orderDate)) {
      rowTimingTd.innerHTML = rowTimingTd.innerHTML + " Order for future date";
      rowTimingTd.style.color = "red";
      return;
    }
    
    const datesRegex = /(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]?(:[0-5][0-9])?.?$/gi;
    const match = rowTimingTd.innerHTML.split("-")[1].match(datesRegex);
    let stringToReplace = match[0];
    let hour = stringToReplace.split(":")[0];
    let minutes = stringToReplace.split(":")[1];
    hour = +hour;
    
    if (hour === 1) {
      hour = "00";
    }
    
    hour === 0 ? hour = "23" : hour--;
    
    let replacedStr = hour + ":" + minutes + " English Time";
    rowTimingTd.innerHTML = rowTimingTd.innerHTML.replace(stringToReplace, replacedStr);
    
    const currentHour = new Date().getHours() - 2; // To english time
    const currentMinutes = new Date().getMinutes();
    
    const currentValue = currentHour * 60 * 60 + currentMinutes * 60;
    const dateValue = +hour * 60 * 60 + +minutes.substr(0, minutes.length - 1) * 60;
    
    if(currentValue - dateValue < 0) {
      rowTimingTd.style.color = "red";
      return;
    }
    
    rowTimingTd.style.color = "green";
  }
}

function IntercomSlackConnection(items, chromeStorage) {
  /* Set initial values */
  const baseColor = "#dfecc9";
  const chatColors = [
    "#BAF2E9",
    "#3381FF",
    "#F2BAC9",
    "#FAF0CA ",
    "#FFC0CB",
    "#B9FFB7",
  ];
  const intercomToSlackMessages = [
    "We have contacted the client",
    "We contacted the client",
    "https://app.slack.com/client/",
    "Message sent to Just Eat in Slack!",
    "One moment please, we are going to confirm with the client",
    "Message sent to client via support-out-client",
    "Cancellation message sent to Slack!",
  ];

  items.onGoingChats === undefined
    ? chromeStorage.local.set({ onGoingChats: "1" })
    : null;
  items.colorCounter === undefined
    ? chromeStorage.local.set({ colorCounter: 0 })
    : null;

  /* Executes in Slack */
  if (window.location.href.indexOf("slack") !== -1) {
    setInterval(function () {
      if (!items.chatRefs) {
        chromeStorage.local.set({ chatRefs: JSON.stringify({}) });
      }

      if (!items.colorCounter) {
        chromeStorage.local.set({ colorCounter: 0 });
      }

      const searchedMessages = document.getElementsByClassName(
        "c-search_message__body"
      );
      const channelMessages = document.getElementsByClassName(
        "c-message_kit__text"
      );
      const allMessages =
        channelMessages.length > 0 ? channelMessages : searchedMessages;
      const manualChannelMessages = document.getElementsByClassName(
        "p-rich_text_section"
      );

      const chatRefs = JSON.parse(items.chatRefs);
      const chatReferences = Object.keys(chatRefs);
      const chatRefsColors = Object.values(chatRefs).map((arr) => arr[1]);
      const chatDeliveryRequests = Object.values(chatRefs).map((arr) => arr[2]);

      crawlSlackChannel(
        allMessages,
        manualChannelMessages,
        chatReferences,
        chatRefsColors,
        chatDeliveryRequests
      );
    }, 2000);

    /**
     * Goes through focused Slack tab, scans and colorises recent chats.
     *
     * @param {NodeList} allMessages
     * @param {NodeList} manualChannelMessages
     * @param {Array} chatReferences
     * @param {Array} chatRefsColors
     * @param chatDeliveryRequests
     * @returns {null}
     */
    function crawlSlackChannel(
      allMessages,
      manualChannelMessages,
      chatReferences,
      chatRefsColors,
      chatDeliveryRequests
    ) {
      for (let i = 0; i < chatReferences.length; i++) {
        const cR = chatReferences[i];
        const dR = chatDeliveryRequests[i];

        for (let j = 0; j < allMessages.length; j++) {
          const foundPackageRefAtIndex = allMessages[j].innerHTML.indexOf(cR);
          const foundDeliveryReqAtIndex = allMessages[j].innerHTML.indexOf(dR);

          if (foundPackageRefAtIndex !== -1 || foundDeliveryReqAtIndex !== -1) {
            allMessages[
              j
            ].parentNode.parentNode.parentNode.style.backgroundColor =
              chatRefsColors[i];
          }
        }
        for (let k = 0; k < manualChannelMessages.length; k++) {
          const foundPackageRefAtIndex =
            manualChannelMessages[k].innerHTML.indexOf(cR);
          const foundDeliveryReqAtIndex =
            manualChannelMessages[k].innerHTML.indexOf(dR);

          if (foundPackageRefAtIndex !== -1 || foundDeliveryReqAtIndex !== -1) {
            manualChannelMessages[
              k
            ].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.backgroundColor =
              chatRefsColors[i];
          }
        }
      }
    }

    return;
  }

  function initialize(element, main_Process) {
    if (!items.chatRefs) {
      chromeStorage.local.set({ chatRefs: JSON.stringify({}) });
    }

    if (!items.colorCounter) {
      chromeStorage.local.set({ colorCounter: 0 });
    }

    if (document != null && $(element).length > 0) {
      clearInterval(launcher);
      main_Process();
    } else {
      launcher();
    }
  }

  var launcher = () =>
    setInterval(function () {
      initialize(".nav__link__text__inbox-name", main);
    }, 2000);

  function main() {
    var channels = $(
      "div.submenu__sections__section__items__inner > div > div > div > span div.nav-vertical__link div[data-popover-opener] div a:not(.c__deemphasized-text)"
    ); // Les liens a où se trouves les
    crawlChannelBoards(channels);
    getUserID();
  }

  function getChannelsBoards() {
    return $(
      "div.submenu__sections__section__items__inner > div > div > div > span div.nav-vertical__link div[data-popover-opener] div a:not(.c__deemphasized-text)"
    ); // Les liens a où se trouves les
  }

  function crawlChannelBoards(channels) {
    var channelLists = [];
    var userID = getUserID;

    getUserID();

    channels.each((i, el) => {
      var channel_link = "https://app.intercom.com/" + $(el).attr("href");
      var channel_id = channel_link.match(/inbox\/inbox\/(\d{7}|view:486)/);
      var channel_name = $(el)
        .find("span.nav__link__text__inbox-name")
        .text()
        .trim();
      var userID = getUserID();

      channelLists.push({
        channelName: channel_name,
        channelLink: channel_link,
        channelId: channel_id,
      });

      chromeStorage.local.set({
        intercom: JSON.stringify({
          channelName: channel_name,
          channelLink: channel_link,
          channelId: channel_id,
          userId: userID,
        }),
      });
    });
  }

  function getUserID() {
    var linkAvatar = "" + $("a.nav__link__inbox-link")[0];
    var regex_avatar = /(\d{7})/;
    var userID = linkAvatar.match(regex_avatar)[0];
    return userID;
  }

  function getUrl() {
    var current_url = window.location.href;
    return current_url;
  }

  function getConvID() {
    var current_url = getUrl();
    var regex_conv_id = /conversations\/(\d+)/;
    return current_url.match(regex_conv_id)[1];
  }

  function storeConvInStorage(new_conv) {
    var forStorage = items.onGoingChats;

    var all_conv = items.onGoingChats.toString().split(",");

    if (!all_conv.includes(new_conv)) {
      all_conv.push(new_conv);
      forStorage = all_conv.join(",");
    }

    chromeStorage.local.set({ onGoingChats: forStorage });
  }

  function inChannel() {
    var channels = getChannelsBoards();
    var in_channel = false;

    $(channels).each((i, channel) => {
      window.location.href.includes(channel) ? (in_channel = true) : null;
    });
    return in_channel;
  }

  function anyPost() {
    var any_post = false;
    $(".ember-view.conversation__stream .o__for-admin a").each((i, e) => {
      if (e.href.match(/admins\/(\d+)/)[1] == getUserID()) {
        any_post = true;
      }
    });
    return any_post;
  }

  function searchForConv() {
    if (inChannel() && anyPost()) {
      var new_conv = getConvID();
      storeConvInStorage(new_conv);
    }
  }

  function getMyChats() {
    var list_chats = $(".inbox__conversation-list-item a");
    var stored_chats = items.onGoingChats.split(",");
    const chatRefs = JSON.parse(
      items.chatRefs !== undefined ? items.chatRefs : JSON.stringify({})
    );
    const chatRefsChatIds = Object.values(chatRefs).map((arr) => arr[0]);
    const chatRefsColors = Object.values(chatRefs).map((arr) => arr[1]);

    for (let i = 0; i < list_chats.length; i++) {
      const currentChat = list_chats[i];

      for (let j = 0; j < chatRefsChatIds.length; j++) {
        let regexCheck = "/conversations/" + chatRefsChatIds[j];
        let regex = new RegExp(regexCheck, "g");

        if (
          $(currentChat).attr("href").match(regex) &&
          stored_chats.indexOf(
            $(currentChat)
              .attr("href")
              .match(/conversations\/(\d+)/)[1]
          ) !== -1
        ) {
          $(currentChat).css("background-color", chatRefsColors[j]);
        }
      }
    }
  }

  setInterval(() => {
    chromeStorage.local.get(null, function (updatedItems) {
      items = updatedItems;
    });

    function initialize_color() {
      if (
        document != null &&
        $(".inbox__conversation-list-item a").length > 0
      ) {
        clearInterval(launcher2);
        main_2();
      } else {
        clearInterval(launcher2);
        launcher2 = setInterval(function () {
          initialize_color();
        }, 2000);
      }
    }

    var launcher2 = setInterval(function () {
      initialize_color();
    }, 2000);
  }, 1000);

  $(document).ready(function (e) {
    function initialize_color() {
      if (
        document != null &&
        $(".inbox__conversation-list-item a").length > 0
      ) {
        clearInterval(launcher2);
        main_2();
      } else {
        clearInterval(launcher2);
        launcher2 = setInterval(function () {
          initialize_color();
        }, 2000);
      }
    }

    var launcher2 = setInterval(function () {
      initialize_color();
    }, 2000);
  });

  function main_2() {
    searchForConv();
    getMyChats();
    extendedChatHighlighting();
  }

  function extendedChatHighlighting() {
    const chatRefs = JSON.parse(
      items.chatRefs !== undefined ? items.chatRefs : JSON.stringify({})
    );
    let counter = items.colorCounter;
    let packageReference = document
      .querySelectorAll(".o__admin-note")[0]
      .innerHTML.split("Reference: ")[1]
      ?.split(" ")[0]
      ?.split("<br>");
    let deliveryRequest = document
      .querySelectorAll(".o__admin-note")[0]
      .innerHTML.split("Delivery Request: ")[1]
      ?.split(" ")[0]
      ?.split("<br>");

    if (!packageReference && !deliveryRequest) return;

    packageReference =
      packageReference?.length > 0 ? packageReference[0] : null;
    deliveryRequest = deliveryRequest?.length > 0 ? deliveryRequest[0] : null;

    const openedChatInfo = document.getElementsByClassName(
      "ember-view conversation__stream"
    )[0];
    const openedChatInfoMessages = openedChatInfo.getElementsByTagName("p");
    const currentChatId = window.location.href.match(/conversations\/(\d+)/)[1];
    let chatReference;

    if (packageReference) {
      chatReference = packageReference;
    } else if (deliveryRequest) {
      chatReference = deliveryRequest;
    }

    if (!chatReference) {
      return;
    }

    if (chatReference && !chatRefs[chatReference] && anyPost()) {
      chatRefs[chatReference] = [currentChatId, baseColor, deliveryRequest];
      chromeStorage.local.set({ chatRefs: JSON.stringify(chatRefs) });
    } else if (
      chatReference &&
      chatRefs[chatReference] &&
      (chatRefs[chatReference][1] === baseColor ||
        !chatRefs[chatReference][1]) &&
      anyPost()
    ) {
      if (counter >= chatColors.length) {
        counter = 0;
        chromeStorage.local.set({ colorCounter: 0 });
      }

      for (let i = 0; i < openedChatInfoMessages.length; i++) {
        for (let j = 0; j < intercomToSlackMessages.length; j++) {
          if (
            openedChatInfoMessages[i].innerHTML.includes(
              intercomToSlackMessages[j]
            )
          ) {
            const currentChatId =
              window.location.href.match(/conversations\/(\d+)/)[1];

            chatRefs[chatReference] = [
              currentChatId,
              chatColors[counter],
              deliveryRequest,
            ];
            chromeStorage.local.set({ colorCounter: +counter + 1 });
            chromeStorage.local.set({ chatRefs: JSON.stringify(chatRefs) });
          }
        }
      }
    }
  }

  function cleanStorage() {
    var myinterval = 15 * 60 * 1000; // 15 min interval
    setInterval(function () {
      resetValues();
    }, myinterval);
  }

  function resetValues() {
    const specialistChatCount = +document
      .getElementsByClassName(
        "submenu__sections__section__items__item__count"
      )[0]
      .innerHTML.trim();

    if (specialistChatCount > 0) return;

    chromeStorage.local.set({ chatRefs: JSON.stringify({}) });
    chromeStorage.local.set({ onGoingChats: "1" });
    if (items.colorCounter >= chatColors.length - 1) {
      chromeStorage.local.set({ colorCounter: 0 });
    } else {
      chromeStorage.local.set({ colorCounter: items.colorCounter + 1 });
    }
  }

  cleanStorage();
}

function BOFilterPackages() {
  const table = document.getElementById("index_table_packages");
  const indexFooter = document.getElementById("index_footer");
  const scopeGroup = document.getElementsByClassName("scope-default-group")[0];
  const multipleChoiceForm = document.createElement("form");
  const select = document.createElement("select");

  if (table) {
    scopeGroup.insertBefore(indexFooter, scopeGroup.childNodes[15]);
    indexFooter.style.marginRight = "250px";
    const rows = table
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr");
    const stopBtn = document.createElement("input");
    createSelectForm(scopeGroup, multipleChoiceForm, select, stopBtn);

    if (localStorage.getItem("tampscript_bo_filtering_value")) {
      openLinks(rows, localStorage.getItem("tampscript_bo_filtering_value"));
    }

    multipleChoiceForm.addEventListener("submit", (e) => {
      const selectedValue = select.options[select.selectedIndex].value;
      localStorage.setItem("tampscript_bo_filtering_value", selectedValue);
    });

    stopBtn.addEventListener("click", (e) => {
      location.reload();
      localStorage.removeItem("tampscript_bo_filtering_value");
    });
  }

  function openLinks(rows, type) {
    for (let i = 0; i < rows.length; i++) {
      const currentRow = rows[i];
      const currentRowStatus = rows[i].getElementsByClassName(type)[0];

      if (currentRowStatus?.innerHTML?.toLowerCase() != type) {
        continue;
      }

      const currentRowId = rows[i]
        .getElementsByClassName("col-id")[0]
        .getElementsByTagName("a")[0];
      const href = currentRowId.getAttribute("href");
      openInNewTab("https://backoffice.internal.stuart.com/" + href);
    }
  }

  function createSelectForm(scopeGroup, multipleChoiceForm, select, stopBtn) {
    /* List Item  */
    const liItem = document.createElement("li");
    liItem.setAttribute("class", "scope");
    liItem.style.marginLeft = "20px";
    liItem.style.height = "28px";

    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = "picking";
    option1.innerHTML = "Picking";

    option2.value = "delivering";
    option2.innerHTML = "Delivering";

    select.appendChild(option1);
    select.appendChild(option2);
    select.style.height = "28px";

    /* submitBtn */
    const submitBtn = document.createElement("input");
    submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("value", "Start Script");
    submitBtn.style.padding = "8px 10px";
    submitBtn.style.marginLeft = "10px";

    stopBtn.setAttribute("type", "button");
    stopBtn.setAttribute("value", "Stop Script");
    stopBtn.style.padding = "8px 10px";
    stopBtn.style.marginLeft = "10px";
    stopBtn.style.border = "none";
    stopBtn.style.borderRadius = "0px";

    submitBtn.disabled = localStorage.getItem("tampscript_bo_filtering_value")
      ? true
      : false;
    stopBtn.disabled = localStorage.getItem("tampscript_bo_filtering_value")
      ? false
      : true;

    stopBtn.style.backgroundColor = stopBtn.disabled ? "grey" : "#8B0000";
    stopBtn.style.background = stopBtn.disabled ? "grey" : "#8B0000";

    submitBtn.style.cursor = submitBtn.disabled ? "not-allowed" : "pointer";
    stopBtn.style.cursor = stopBtn.disabled ? "not-allowed" : "pointer";

    submitBtn.style.backgroundColor = submitBtn.disabled ? "grey" : "#11a3eb";
    submitBtn.style.background = submitBtn.disabled ? "grey" : "#11a3eb";

    /* Append everything */
    multipleChoiceForm.appendChild(select);
    multipleChoiceForm.appendChild(submitBtn);
    multipleChoiceForm.appendChild(stopBtn);
    liItem.appendChild(multipleChoiceForm);
    scopeGroup.insertBefore(liItem, scopeGroup.childNodes[14]);
  }

  function openInNewTab(href) {
    Object.assign(document.createElement("a"), {
      target: "_blank",
      href: href,
    }).click();
  }
}