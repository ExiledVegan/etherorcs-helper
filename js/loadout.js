function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadout() {

    $(".character-select-wrapper .select-map-button").click();
    await sleep(1500);

    async function onGot(loadout) {
        console.log("loadout: ", loadout)

        if (!loadout.cfg_loadout.solo) loadout.cfg_loadout.solo = cfg_loadout.solo;
        if (!loadout.cfg_loadout.party) loadout.cfg_loadout.party = cfg_loadout.party;

        // Create "Save Loadout" button
        if (!$(".save-loadout").length) {
            $(".character-select-dialog .toolbar").append("<button class=\"MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root save-loadout console-link-button css-onqdri\" type=\"button\"><b>X</b> Save Loadout<span class=\"MuiTouchRipple-root css-w0pj6f\"></span></button>")

            // Save loadout method
            $(document).on('click', '.save-loadout', async function () {
                if ($(".character-select-wrapper button[aria-pressed='true']").attr("value") == "party") {

                } else {
                    let new_solo = [];
                    $(".character-selector-inner .character").each(function (index, element) {
                        let character = {};

                        if ($(element).hasClass("selected")) {
                            if (!$(element).hasClass("active")) {
                                $(".character.active").removeClass("active");
                                $(element).addClass("active");
                            }

                            character.id = parseInt($(element).attr("data-id"), 10);

                            let ar, mh, oh;
                            $(".inventory .item").each(function (i, e) {
                                if ($(e).find(".equipped").length !== 0) {
                                    let type = $(e).find(".type").html();
                                    let src = $(e).find("img").attr("src");

                                    $(".item-slot").each(function (ii, ee) {
                                        let typeSlot = $(ee).find(".type").html();
                                        let srcSlot = $(ee).find("img").attr("src");

                                        if (type == typeSlot && src == srcSlot) {
                                            switch (type) {
                                                case 'AR':
                                                    ar = i + 1;
                                                    break;
                                                case 'MH':
                                                    mh = i + 1;
                                                    break;
                                                case 'OH':
                                                    oh = i + 1;
                                                    break;
                                            }
                                        }

                                    })
                                }
                            });

                            character.ar = ar;
                            character.mh = mh;
                            character.oh = oh;

                            new_solo.push(character);
                        }
                    });

                    loadout.cfg_loadout.solo = new_solo;
                }

                console.log("new loadout: ", loadout.cfg_loadout)

                browser.storage.sync.set({
                    cfg_loadout: loadout.cfg_loadout
                });

                console.log("saved loadout!")

                $(".save-loadout").html("<b>X</b> Save Loadout - Success!<span class=\"MuiTouchRipple-root css-w0pj6f\"></span>");

                await sleep(2000);

                $(".save-loadout").html("<b>X</b> Save Loadout<span class=\"MuiTouchRipple-root css-w0pj6f\"></span>");
            });

            $(".character-selector .character").each(function () {
                const orcNumber = $(this).find(".MuiListItemText-primary").text().replace(/\D/g, '');
                const orcLevel = parseInt($(this).find(".MuiListItemText-secondary").text().replace(/\D/g, '')) - ($(this).hasClass("disabled") ? 100000 : 0);
                let race = "orc";
                if (orcNumber > 5050) race = "shaman";
                if (orcNumber > 8050) race = "ogre";
                if (orcNumber > 11050) race = "rogue";
                if (orcNumber > 14050) race = "mage";

                if (!$(this).hasClass("race_" + race)) $(this).addClass("race_" + race);
                $(this).attr("data-sort", orcLevel);
                $(this).attr("data-id", orcNumber);
            });

            let cfg = loadout.cfg_loadout.solo;
            if ($(".character-select-wrapper button[aria-pressed='true']").attr("value") == "party") {
                cfg = loadout.cfg_loadout.party;
            }

            for (let i = 0; i < cfg.length; i++) {
                let cfgitem = cfg[i];

                if (cfgitem.id < 1) continue;

                $(".character-selector-inner .character[data-id='" + cfgitem.id + "'] button").click();

                let itemSlot = $(".character-overview .item-slot");

                itemSlot.eq(0).click();

                await sleep(1500);

                if (cfgitem.ar >= 1) $(".inventory button").eq(cfgitem.ar - 1).click(); //AR

                itemSlot.eq(1).click();

                await sleep(500);

                if (cfgitem.mh >= 1) $(".inventory button").eq(cfgitem.mh - 1).click(); //MH

                itemSlot.eq(2).click();

                await sleep(500);

                if (cfgitem.oh >= 1) {
                    $(".inventory button").eq(cfgitem.oh - 1).click(); //OH
                    await sleep(500);
                }
            }

            $(".character-selector-inner").prepend($(".character-selector-inner .character.selected"));
        }
    }

    // Error handler
    function onError(error) {
        console.log(`Error: ${error}`);
    }

    // Loadout saved in local storage
    let new_loadout = browser.storage.sync.get("cfg_loadout");
    new_loadout.then(onGot, onError);
}

$(document).ready(function () {
    $(document).on("click", ".charSelFilter a", function () {
        const filterRace = $(this).attr("id").replace("filter_", "");
        if (filterRace == "all") {
            $(".character-selector .character").show();
        } else {
            $(".character-selector .character").hide();
            $(".character-selector .character.race_" + filterRace).show();
        }
        $(".charSelFilter a").removeClass("specialActive");
        $(this).addClass("specialActive");
    });
    const body = $("body");

    body.append('<div id="specialIcon" class="toggleSpecialMenu">Menu</div>');
    body.append(`<div id="specialMenu"><ul>
	<li><a href="https://etherorcs.com/dapp" target="_blank">Terminal</a></li>
	<li><a href="https://dungeons.etherorcs.com/?start" target="_blank">Dungeons</a></li>
	<li><a href="https://etherorcs.com/town/emporium" target="_blank">Open Chests</a></li>
	<li><a href="https://etherorcs.com/town/crafting" target="_blank">Blacksmith</a></li>
	<li><a href="https://etherorcs.com/town/marketplace" target="_blank">Marketplace</a></li>
	<li><a class="toggleSpecialMenu" href="#">[close]</a></li>
	</ul></div>`);
    $(".toggleSpecialMenu").click(function (e) {
        e.preventDefault();
        $("#specialMenu").toggle();
    });


    if ($(".dungeon-crawler").length > 0) {
        $(document).on('DOMSubtreeModified', function () {
            let mapBtn = $(".character-select-wrapper .select-map-button");
            if (mapBtn.length > 0 && $("#loadout").length < 1) {
                mapBtn.after('<div id="loadout">Use Loadout</div>');
                $("#loadout").click(function () {
                    $(this).hide();
                    loadout();
                });
            }
        });
    }

    // Instant animations inline script
    let script = '' +
        'function waitForElm(selector) {\n' +
        '    return new Promise(resolve => {\n' +
        '        if (document.querySelector(selector)) {\n' +
        '            return resolve(document.querySelector(selector));\n' +
        '        }\n' +
        '\n' +
        '        const observer = new MutationObserver(mutations => {\n' +
        '            if (document.querySelector(selector)) {\n' +
        '                resolve(document.querySelector(selector));\n' +
        '                observer.disconnect();\n' +
        '            }\n' +
        '        });\n' +
        '\n' +
        '        observer.observe(document.body, {\n' +
        '            childList: true,\n' +
        '            subtree: true\n' +
        '        });\n' +
        '    });\n' +
        '}\n' +
        '\n' +
        'waitForElm(\'.player\').then((elm) => {\n' +
        '    console.log(\'Element is ready\');\n' +
        '\n' +
        '    // Remove all timeouts thus making animations instant\n' +
        '    window.setTimeout = ((original) =>\n' +
        '            (codeOrFunc, delay, ...args) =>\n' +
        '                original(codeOrFunc, 0, ...args)\n' +
        '    )(window.setTimeout);\n' +
        '});';
    let scriptEl = document.createElement('script');
    scriptEl.textContent = script;
    document.head.appendChild(scriptEl);
});