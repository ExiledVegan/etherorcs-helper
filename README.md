<h2>EtherOrcs Companion - Firefox Extension</h2>
<h3>Chrome Extension: https://github.com/blumentopf-eth/etherorcs-helper </h3>
<hr>
<p>The purpose of this project is to further improve the EtherOrcs experience with various tweaks and fixes.</p>
<p>In the current stage all the improvements are aimed towards the dungeons subdomain. Future versions will aim to improve
other parts of the website as well, such as the town and game terminal.</p>
<p>Features:</p>
<ul>
    <li>Instant loading of all the in-game animations</li>
    <li>Remove dungeon shadow effect</li>
    <li>Equip your own loadout</li>
    <li>Added a menu to dungeon page with access to other orc links</li>
</ul>
<hr>
<h3>Installing</h3>
<p>In Firefox: Open the about:debugging page, click the This Firefox option, click the Load Temporary Add-on button, then select any file in your extension's directory.</p>
<p>The extension now installs, and remains installed until you restart Firefox.</p>
<p>Alternatively, you can run the extension from the command line using the web-ext tool.</p>
<hr>
<h3> Loadout </h3>
<p>1. Visit https://dungeons.etherorcs.com/?start and press `SELECT CHARACTERS`, note that every item has a number now</p>
<p>2. Open `settings.js` of this extension</p>
<p>3. Replace the `0` values with the according id/numbers, `id` = you characters #id `ar` = armor, `mh` = mainhand, `oh` = offhand</p>
<p>4. Save your changes and reload the extension in about:debugging#/runtime/this-firefox</p>
<p>5. Visit https://dungeons.etherorcs.com/?start and press `Use Loadout`</p>
<p>6. Check if every character was equipped correctly</p>