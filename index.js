window.Pontica = {
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
				
				if (img.src === "https://backoffice.internal.stuart.com/assets/ic_marker_bike-e0b02ac69ce8020cfa02e31cf9954fdb5d304d009ba0de2d1a268716cfd68519.png") {
						paragraph.innerHTML = "Bike";
						imgParent.appendChild(paragraph);
				}
				
				if (img.src === "https://backoffice.internal.stuart.com/assets/ic_marker_motorbike-0044facd69a2d45b675726b7e6e069fd2badba6e2a05842dbc4bf957d6caed8c.png") {
						paragraph.innerHTML = "Motorbike";
						imgParent.appendChild(paragraph);
				}
				
				if (img.src === "https://backoffice.internal.stuart.com/assets/ic_marker_car-7a8d8d68ce6bdad7a16dd2dd70876ced3327656418b34e0765b907c2e8beee66.png") {
						paragraph.innerHTML = "Car";
						imgParent.appendChild(paragraph);
				}
		},
		FilteringPackages: function FilteringPackages() {
				const table = document.getElementById("index_table_packages");
				const indexFooter = document.getElementById("index_footer");
				const scopeGroup = document.getElementsByClassName("scope-default-group")[0];
				const multipleChoiceForm = document.createElement("form");
				const select = document.createElement("select");
				
				if (table) {
						scopeGroup.insertBefore(indexFooter, scopeGroup.childNodes[15]);
						indexFooter.style.marginRight = "250px";
						const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
						const stopBtn = document.createElement("input");
						createSelectForm(scopeGroup, multipleChoiceForm, select, stopBtn);
						
						if (localStorage.getItem("tampscript_bo_filtering_value")) {
								openLinks(rows, localStorage.getItem("tampscript_bo_filtering_value"));
						}
						
						multipleChoiceForm.addEventListener("submit", () => {
								const selectedValue = select.options[select.selectedIndex].value;
								localStorage.setItem("tampscript_bo_filtering_value", selectedValue);
						});
						
						stopBtn.addEventListener("click", () => {
								location.reload();
								localStorage.removeItem("tampscript_bo_filtering_value");
						});
				}
				
				function openLinks(rows, type) {
						for (let i = 0; i < rows.length; i++) {
								const currentRowStatus = rows[i].getElementsByClassName(type)[0];
								
								if (currentRowStatus?.innerHTML?.toLowerCase() !== type) {
										continue;
								}
								
								const currentRowId = rows[i].getElementsByClassName("col-id")[0].getElementsByTagName("a")[0];
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
						
						submitBtn.disabled = !!localStorage.getItem("tampscript_bo_filtering_value");
						stopBtn.disabled = !localStorage.getItem("tampscript_bo_filtering_value");
						
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
						Object.assign(document.createElement('a'), {
								target: '_blank', href: href,
						}).click();
				}
		},
		FountainImprovements: function FountainImprovements() {
				let interval = setInterval(main, 2000);
				let hasCheckedIfRejected = false;
				
				$(".js-applicants-search").on("submit", function () {
						hasCheckedIfRejected = false;
				});
				
				function main() {
						const transitionEventsDiv = $("#transition-events");
						
						if (transitionEventsDiv.length > 0) {
								transitionEventsDiv.css("display", "none");
						}
						
						let select = $("#funnel_id");
						let moveToModal = $("#batch-move-to-stage-modal"); // to identify whether the Move To modal is opened.
						
						const userInfo = $(".obiq-table__cell > a")[1]?.innerHTML;
						
						if (!userInfo) {
								return;
						}
						
						const userPlaceVehicle = userInfo.split("/")[0];
						
						if (isRejected() && !hasCheckedIfRejected) {
								hasCheckedIfRejected = true;
								alert("Rejected driver/Repeat offender/Offboarded");
						}
						
						if (moveToModal.css('display') === 'block') {
								const options = $("#funnel_id option");
								
								options.each((i) => {
										if (options[i].innerHTML === userPlaceVehicle) {
												select.val(options[i].value);
												clearInterval(interval);
												restartMainInterval();
												return false;
										}
								});
						}
						
						function restartMainInterval() {
								let restartInterval = setInterval(() => {
										let moveToModal = $("#batch-move-to-stage-modal"); // to identify whether the Move To modal is opened.
										
										const footerCheckbox = document.querySelectorAll("#should_run_when_land");
										
										if (footerCheckbox[1] && footerCheckbox[1].checked === true) {
												footerCheckbox[1].click();
										}
										
										if (moveToModal.css('display') !== 'block') {
												interval = setInterval(main, 2000);
												clearInterval(restartInterval);
												hasCheckedIfRejected = false;
										}
								}, 1000);
								
						}
						
						function isRejected() {
								const userInfo = $(".obiq-table__cell > a");
								
								for (let i = 1; i < userInfo.length; i += 2) {
										const userInfo = $(".obiq-table__cell > a")[i].innerHTML;
										const userStatus = userInfo.split("/")[1];
										
										if (userStatus.indexOf("Rejected") >= 0 || userStatus.indexOf("Repeat Offenders") >= 0 || userStatus.indexOf("Offboarded") >= 0) {
												return true;
										}
								}
								
								return false;
						}
				}
		},
		IntercomToBO: function IntercomToBO() {
				let userInfoBox;
				let qualityBox;
				
				setInterval(function () {
						userInfoBox = document.querySelectorAll("[data-key='user_id']")[0];
						
						if (userInfoBox) {
								const driverIdLink = userInfoBox.getElementsByTagName('a')[0];
								const driverId = driverIdLink.innerHTML;
								driverIdLink.href = "https://backoffice.internal.stuart.com/admin/drivers/" + driverId;
						}
						
						qualityBox = document.querySelectorAll(".attribute__qualification-list")[0];
						
						if (qualityBox) {
								const qualityBoxItems = qualityBox.getElementsByTagName("div");
								
								for (let i = 0; i < qualityBoxItems.length; i++) {
										qualityBoxItems[i].style.pointerEvents = "none";
								}
						}
						
				}, 2000);
		},
		MagnifyFountainImages: function MagnifyFountainImages() {
				const form = document.querySelectorAll(".js-applicants-search")[0];
				
				let imageOpenContainer = document.createElement("div");
				imageOpenContainer.style.width = "1000px";
				imageOpenContainer.style.height = "100vh";
				imageOpenContainer.style.position = "absolute";
				imageOpenContainer.style.pointerEvents = "none";
				imageOpenContainer.style.top = "0";
				imageOpenContainer.style.left = "0";
				imageOpenContainer.style.backgroundSize = "contain";
				imageOpenContainer.style.backgroundRepeat = "no-repeat";
				imageOpenContainer.style.zIndex = "999";
				document.getElementsByTagName("body")[0].appendChild(imageOpenContainer);
				
				let toggleSavedImagesBtn = document.createElement("button");
				toggleSavedImagesBtn.style.position = "fixed";
				toggleSavedImagesBtn.style.left = "30px";
				toggleSavedImagesBtn.style.bottom = "60px";
				toggleSavedImagesBtn.style.borderRadius = "5px";
				toggleSavedImagesBtn.style.border = "none";
				toggleSavedImagesBtn.innerHTML = "History";
				toggleSavedImagesBtn.style.opacity = "0";
				toggleSavedImagesBtn.style.pointerEvents = "none";
				toggleSavedImagesBtn.style.zIndex = "999";
				toggleSavedImagesBtn.style.padding = "5px 15px";
				document.getElementsByTagName("body")[0].appendChild(toggleSavedImagesBtn);
				
				let containerSavedImages = document.createElement("div");
				containerSavedImages.style.position = "fixed";
				containerSavedImages.style.left = "110px";
				containerSavedImages.style.bottom = "100px";
				containerSavedImages.style.border = "none";
				containerSavedImages.style.opacity = "0";
				containerSavedImages.style.pointerEvents = "none";
				containerSavedImages.style.zIndex = "999";
				containerSavedImages.style.transition = "opacity .3s";
				document.getElementsByTagName("body")[0].appendChild(containerSavedImages);
				
				toggleSavedImagesBtn.addEventListener("click", function () {
						if (containerSavedImages.style.opacity === "1") {
								containerSavedImages.style.opacity = "0";
								containerSavedImages.style.pointerEvents = "none";
								return;
						}
						
						containerSavedImages.style.opacity = "1";
						containerSavedImages.style.pointerEvents = "all";
				});
				
				let savedImages;
				let shouldSaveImages = true;
				
				setInterval(function () {
						const previewContainers = document.querySelectorAll(".applicant-profile-documents__item-preview-column");
						
						if (!previewContainers || previewContainers.length === 0) {
								return;
						}
						
						toggleSavedImagesBtn.style.opacity = "1";
						toggleSavedImagesBtn.style.pointerEvents = "all";
						
						for (let i = 0; i < previewContainers.length; i++) {
								const container = previewContainers[i];
								const actionLinkContainer = previewContainers[i].nextElementSibling;
								let actionLink = actionLinkContainer.getElementsByTagName("a")[0];
								
								if (shouldSaveImages) {
										savedImages = document.createElement("div");
										containerSavedImages.appendChild(savedImages);
										let newLink = document.createElement("a");
										let newLinkText = document.createTextNode(container.parentNode.parentNode.firstChild.innerHTML);
										newLink.href = actionLink.href;
										newLink.style.zIndex = "999";
										newLink.classList.add("save-history-link");
										newLink.appendChild(newLinkText);
										
										savedImages.appendChild(newLink);
								}
								
								if (actionLink.getAttribute("download").split(".")[actionLink.getAttribute("download").split(".").length - 1] === "pdf") {
										continue;
								}
								
								let img = document.createElement("img");
								img.style.width = "100%";
								img.style.width = "100%";
								img.src = actionLink.href;
								img.onerror = "image_error";
								
								container.addEventListener("mouseenter", function () {
										imageOpenContainer.style.backgroundImage = "url('" + actionLink + "')";
								});
								
								container.addEventListener("mouseleave", function () {
										imageOpenContainer.style.backgroundImage = "none";
								});
						}
						
						if (shouldSaveImages) {
								shouldSaveImages = false;
								let links = document.getElementsByClassName("save-history-link");
								
								if (links.length > 0) {
										return;
								}
								
								containerSavedImages.appendChild(savedImages);
						}
						
						form.addEventListener("submit", function (e) {
								shouldSaveImages = true;
								let links = document.getElementsByClassName("save-history-link");
								
								while (links.length > 0) {
										links[0].remove();
								}
						});
				}, 1000);
		},
		MASidebarMod: function MASidebarMod() {
				setTimeout(() => main(), 500);
				
				function main() {
						const timezones = {
								BG: "BG", EN: "EN",
						};
						
						// Choose your PC's timezone: English(timezons.EN) or Bulgarian(timezones.BG) and replace it in the parentheses below. English by default.
						sidebarHourToEnglishTime(timezones.BG);
						
						const zone = document.querySelectorAll("[href*='/admin/zones/']")[0].innerHTML;
						const assignSidebar = document.getElementById('assign-a-driver_sidebar_section');
						
						if (!assignSidebar) {
								return;
						}
						
						const assignSidebarH3 = assignSidebar.getElementsByTagName('h3')[0];
						const panelContentsSmall = document.getElementsByClassName('panel_contents small')[0];
						const invitationsTable = document.getElementsByClassName('panel_contents')[6];
						const hasCurrentPending = invitationsTable.getElementsByClassName('status_tag pending').length > 0;
						const eligibleDriversTbody = document.querySelectorAll("table.eligible-drivers > tbody")[0];
						let newTbody = document.createElement('tbody');
						const opsActionsDiv = document.getElementById('ops_actions');
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
								assignSidebarH3.style.color = "green";
								assignSidebarH3.style.fontSize = "20px";
								assignSidebarH3.innerHTML = "LEEDS PACKAGE";
						}
						
						increaseWidth(assignSidebar, panelContentsSmall);
						
						let sortedDriverDistances = sortDriversByDistance(eligibleDriversTbody, newTbody);
						
						const assignedDrivers = getPrevAssignedDrivers(opsActionsDiv, opsActionsTr);
						
						sortedDriverDistances
								.forEach((dist, i) => markIfAssigned(dist, i, assignedDrivers, newTbody, selfAssignedDriversIds));
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
				 * @returns {Boolean} bool
				 */
				function hasAssigned(assignSidebar, panelContentsSmall) {
						return assignSidebar !== null && panelContentsSmall !== null;
				}
				
				/**
				 * Increase Sidebar Width
				 * @param assignSidebar
				 * @param {HTMLElement} panelContentsSmall
				 */
				function increaseWidth(assignSidebar, panelContentsSmall) {
						assignSidebar.style.width = '500px';
						assignSidebar.style.marginLeft = '-210px';
						panelContentsSmall.style.maxWidth = '500px';
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
								const currentTd = opsActionsTr[i].getElementsByTagName('td')[1]?.innerHTML?.split(" ");
								if (currentTd[0] + " " + currentTd[1] === "Manual Assignment:" && currentTd[2] !== "Failed") {
										const driverId = currentTd[currentTd.length - 4];
										result.push(driverId);
								}
						}
						
						return result;
				}
				
				/**
				 * Gives indication of whether the package is scheduled for the future and if so, indicates with red, otherwise - green;
				 * @returns {Array<string>|null} result
				 * @param localTime
				 */
				function sidebarHourToEnglishTime(localTime) {
						const rowTiming = document.querySelectorAll(".row-timing")[0];
						let rowTimingTd = rowTiming.getElementsByTagName("td")[0];
						const date = rowTimingTd.innerHTML.split("/");
						const orderDay = date[0].substr(date[0].length - 2, date[0].length);
						const orderMonth = date[1];
						const orderYear = date[2].split("-")[0].trim();
						const orderDate = dayjs(orderYear + "-" + orderMonth + "-" + orderDay);
						const now = dayjs();
						
						if (now.isBefore(orderDate, "day")) {
								rowTimingTd.innerHTML = rowTimingTd.innerHTML + " Order for future date";
								rowTimingTd.style.color = "red";
								return null;
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
						
						const currentHour = localTime === "EN" ? new Date().getHours() : new Date().getHours() - 2;
						const currentMinutes = new Date().getMinutes();
						
						const currentValue = currentHour * 60 * 60 + currentMinutes * 60;
						const dateValue = +hour * 60 * 60 + +minutes.substr(0, minutes.length - 1) * 60;
						
						if (currentValue - dateValue < 0) {
								rowTimingTd.style.color = "red";
								return null;
						}
						
						rowTimingTd.style.color = "green";
				}
		},
		IntercomSlackConnection: function IntercomSlackConnection(chromeStorage) {
				chromeStorage.local.get(null, function (items) {
						/* Set initial values */
						const baseColor = "#dfecc9";
						const chatColors = ['#BAF2E9', '#3381FF', '#F2BAC9', '#FAF0CA ', '#FFC0CB', '#B9FFB7'];
						const intercomToSlackMessages = [
								"We have contacted the client",
								"We contacted the client",
								"https://app.slack.com/client/",
								"Message sent to Just Eat in Slack!",
								"One moment please, we are going to confirm with the client",
								"Message sent to client via support-out-client",
								"Cancellation message sent to Slack!",
						];
						
						items.onGoingChats == null ? chromeStorage.local.set({ onGoingChats: "" }) : null;
						
						/* Executes in Slack */
						if (window.location.href.indexOf('slack') !== -1) {
								setInterval(function () {
										if (!items.chatRefs) {
												chromeStorage.local.set({ chatRefs: JSON.stringify({}) });
										}
										
										if (!items.colorCounter) {
												chromeStorage.local.set({ colorCounter: 0 });
										}
										
										const searchedMessages = document.getElementsByClassName('c-search_message__body');
										const channelMessages = document.getElementsByClassName('c-message_kit__text');
										const allMessages = channelMessages.length > 0 ? channelMessages : searchedMessages;
										const manualChannelMessages = document.getElementsByClassName('p-rich_text_section');
										
										const chatRefs = JSON.parse(items.chatRefs);
										const chatReferences = Object.keys(chatRefs);
										const chatRefsColors = Object.values(chatRefs).map(arr => arr[1]);
										const chatDeliveryRequests = Object.values(chatRefs).map(arr => arr[2]);
										
										crawlSlackChannel(allMessages, manualChannelMessages, chatReferences, chatRefsColors, chatDeliveryRequests);
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
								function crawlSlackChannel(allMessages, manualChannelMessages, chatReferences, chatRefsColors, chatDeliveryRequests) {
										for (let i = 0; i < chatReferences.length; i++) {
												const cR = chatReferences[i];
												const dR = chatDeliveryRequests[i];
												
												for (let j = 0; j < allMessages.length; j++) {
														const foundPackageRefAtIndex = allMessages[j].innerHTML.indexOf(cR);
														const foundDeliveryReqAtIndex = allMessages[j].innerHTML.indexOf(dR);
														
														if (foundPackageRefAtIndex !== -1 || foundDeliveryReqAtIndex !== -1) {
																allMessages[j].parentNode.parentNode.parentNode.style.backgroundColor = chatRefsColors[i];
														}
												}
												for (let k = 0; k < manualChannelMessages.length; k++) {
														const foundPackageRefAtIndex = manualChannelMessages[k].innerHTML.indexOf(cR);
														const foundDeliveryReqAtIndex = manualChannelMessages[k].innerHTML.indexOf(dR);
														
														if (foundPackageRefAtIndex !== -1 || foundDeliveryReqAtIndex !== -1) {
																manualChannelMessages[k]
																		.parentNode
																		.parentNode
																		.parentNode
																		.parentNode
																		.parentNode
																		.parentNode
																		.parentNode
																		.style.backgroundColor = chatRefsColors[i];
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
						
						var launcher = () => setInterval(function () {
								initialize('.nav__link__text__inbox-name', main);
						}, 2000);
						
						function main() {
								var channels = $('div.submenu__sections__section__items__inner > div > div > div > span div.nav-vertical__link div[data-popover-opener] div a:not(.c__deemphasized-text)'); // Les liens a où se trouves les
								crawlChannelBoards(channels);
								getUserID();
								
						}
						
						function getChannelsBoards() {
								
								return $('div.submenu__sections__section__items__inner > div > div > div > span div.nav-vertical__link div[data-popover-opener] div a:not(.c__deemphasized-text)'); // Les liens a où se trouves les
								
						}
						
						function crawlChannelBoards(channels) {
								var channelLists = [];
								var userID = getUserID;
								
								getUserID();
								
								channels.each((i, el) => {
										
										var channel_link = 'https://app.intercom.com/' + $(el).attr('href');
										var channel_id = channel_link.match(/inbox\/inbox\/(\d{7}|view:486)/);
										var channel_name = $(el).find('span.nav__link__text__inbox-name').text().trim();
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
								var linkAvatar = '' + $('a.nav__link__inbox-link')[0];
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
								if (!forStorage) return;
								
								var all_conv = items.onGoingChats.toString().split(',');
								
								if (!all_conv.includes(new_conv)) {
										all_conv.push(new_conv);
										forStorage = all_conv.join(",");
								}
								
								chromeStorage.local.set({onGoingChats: forStorage});
						}
						
						function inChannel() {
								var channels = getChannelsBoards();
								var in_channel = false;
								
								$(channels).each((i, channel) => {
										window.location.href.includes(channel) ? in_channel = true : null;
								});
								return in_channel;
						}
						
						function anyPost() {
								var any_post = false;
								$('.ember-view.conversation__stream .o__for-admin a').each((i, e) => {
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
								var list_chats = $('.inbox__conversation-list-item a');
								var stored_chats = items.onGoingChats.split(',');
								const chatRefs = JSON.parse(items.chatRefs !== undefined ? items.chatRefs : {});
								const chatRefsChatIds = Object.values(chatRefs).map(arr => arr[0]);
								const chatRefsColors = Object.values(chatRefs).map(arr => arr[1]);
								
								for (let i = 0; i < list_chats.length; i++) {
										const currentChat = list_chats[i];
										
										for (let j = 0; j < chatRefsChatIds.length; j++) {
												let regexCheck = "/conversations/" + chatRefsChatIds[j];
												let regex = new RegExp(regexCheck, "g");
												
												if ($(currentChat).attr('href').match(regex) && stored_chats.indexOf($(currentChat).attr('href').match(/conversations\/(\d+)/)[1]) !== -1) {
														$(currentChat).css('background-color', chatRefsColors[j]);
												}
										}
								}
						}
						
						setInterval(() => {
								chromeStorage.local.get(null, function(updatedItems) {
										items = updatedItems;
								});
								
								function initialize_color() {
										if (document != null && $('.inbox__conversation-list-item a').length > 0) {
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
						}, 1000)
						
						$(document).ready(function (e) {
								function initialize_color() {
										if (document != null && $('.inbox__conversation-list-item a').length > 0) {
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
								console.log(items);
								const chatRefs = JSON.parse(items.chatRefs);
								let counter = items.colorCounter;
								let packageReference = document.querySelectorAll(".o__admin-note")[0].innerHTML.split('Reference: ')[1]?.split(' ')[0]?.split('<br>');
								let deliveryRequest = document.querySelectorAll(".o__admin-note")[0].innerHTML.split('Delivery Request: ')[1]?.split(' ')[0]?.split('<br>');
								
								if(!packageReference && !deliveryRequest) return;
								
								packageReference = packageReference?.length > 0 ? packageReference[0] : null;
								deliveryRequest = deliveryRequest?.length > 0 ? deliveryRequest[0] : null;
								
								const openedChatInfo = document.getElementsByClassName('ember-view conversation__stream')[0];
								const openedChatInfoMessages = openedChatInfo.getElementsByTagName('p');
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
										chromeStorage.local.set({chatRefs: JSON.stringify(chatRefs)});
										
								} else if (chatReference && chatRefs[chatReference] && (chatRefs[chatReference][1] === baseColor || !chatRefs[chatReference][1]) && anyPost()) {
										if (counter >= chatColors.length) {
												chromeStorage.local.set({colorCounter: 0});
										}
										
										for (let i = 0; i < openedChatInfoMessages.length; i++) {
												for (let j = 0; j < intercomToSlackMessages.length; j++) {
														if (openedChatInfoMessages[i].innerHTML.includes(intercomToSlackMessages[j])) {
																const currentChatId = window.location.href.match(/conversations\/(\d+)/)[1];
																
																chatRefs[chatReference] = [currentChatId, chatColors[counter], deliveryRequest];
																chromeStorage.local.set({colorCounter: +counter + 1});
																chromeStorage.local.set({chatRefs: JSON.stringify(chatRefs)});
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
								const specialistChatCount = +document.getElementsByClassName('submenu__sections__section__items__item__count')[0].innerHTML.trim();
								
								if (specialistChatCount > 0) return;
								
								chromeStorage.local.set({chatRefs: JSON.stringify({})})
								chromeStorage.local.set({onGoingChats: ""})
								if(items.colorCounter >= chatColors.length - 1) {
										chromeStorage.local.set({colorCounter: 0})
								} else {
										chromeStorage.local.set({colorCounter: items.colorCounter + 1})
								}
						}
						
						cleanStorage();
				});
		},
};