function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadout() {
    $(".character-select-wrapper .select-map-button").click();
    await sleep(1500);
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

    let cfg = cfg_loadout.solo;
    if ($(".character-select-wrapper button[aria-pressed='true']").attr("value") == "party") {
        cfg = cfg_loadout.party;
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
});