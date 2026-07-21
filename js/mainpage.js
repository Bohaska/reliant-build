(async () => {
    /* Every button with class "ajaxbutton" indicates that the button makes a request to
     * the NS server. The "makeAjaxQuery" function will disable these buttons when a request
     * starts and will only be re-enabled once a complete response has been received from the
     * NS server in order to comply with rule "4. Avoid Simultaneous Requests".
     */
    const pageContent = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Reliant</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="background-repeat: no-repeat; background-size: cover; background-position: center center; background-attachment: fixed;">
        <div id="container">
            <div id="group-2">
                <!-- Switchers -->
                <div id="switchers-container">
                    <span class="header"><span class="ns-heading-icon icon-users"></span>Switchers Left</span>
                    <span class="information" id="num-switchers">0</span>
                </div>
                <div id="load-time-container">
                    <span class="subheader">Load Time</span>
                    <span class="information" id="load-time"></span>
                </div>
                <!-- Current WA Nation -->
                <div id="current-wa-nation-container">
                    <div class="buttonblock">
                        <input type="button" class="ajaxbutton" id="update-localid" value="Update Localid">
                        <input type="button" id="copy-nation-link" value="Copy Link">
                    </div>
                    <span id="current-wa-nation-header" class="header"><span class="ns-heading-icon icon-wa"></span>Current WA Nation</span>
                    <div class="buttonblock">
                        <input type="button" id="resign" value="Resign" class="ajaxbutton nation-action-button button-destructive">
                        <input type="button" id="admit" value="Admit on Next Switcher" class="ajaxbutton nation-action-button">
                    </div>
                    <span id="current-wa-nation" class="information">N/A</span>
                    <div class="appearance-footer">
                        <button type="button" id="appearance-toggle" class="appearance-toggle"><span aria-hidden="true">⚙</span> Appearance</button>
                    </div>
                    <div id="appearance-settings" class="appearance-settings hidden">
                        <p>
                            <span class="subheader">Background Image</span>
                            <input type="file" id="appearance-background-image" accept="image/*">
                        </p>
                        <p>
                            <input type="button" id="appearance-remove-background-image" value="Remove Image">
                        </p>
                        <p>
                            <span class="subheader">Background Color</span>
                            <input type="color" id="appearance-background-color" value="#0d1117">
                        </p>
                        <p>
                            <span class="subheader">Background Amount</span>
                            <input type="range" id="appearance-background-amount" min="0" max="100" value="0">
                            <span id="appearance-background-amount-output">0</span>%
                        </p>
                        <p>
                            <span class="subheader">Panel Amount</span>
                            <input type="range" id="appearance-panel-amount" min="0" max="100" value="0">
                            <span id="appearance-panel-amount-output">0</span>%
                        </p>
                        <p>
                            <span class="subheader">Panel Blur</span>
                            <input type="range" id="appearance-panel-blur" min="0" max="24" value="0">
                            <span id="appearance-panel-blur-output">0</span>px
                        </p>
                        <input type="button" id="appearance-save" value="Save">
                    </div>
                </div>
                <!-- Status -->
                <div id="status-container">
                    <span id="status-header" class="header"><span class="ns-heading-icon icon-status"></span>Status</span>
                    <span id="status" class="information">N/A</span>
                </div>
                <!-- Current Region -->
                <div id="current-region-container">
                    <span id="current-region-header" class="header"><span class="ns-heading-icon icon-region"></span>Current Region</span>
                    <span id="current-region" class="information">N/A</span>
                    <span class="subheader">WA Delegate</span>
                    <span class="information" id="wa-delegate">N/A</span>
                    <span class="subheader">Last WA Update</span>
                    <span class="information" id="last-wa-update">N/A</span>
                    <input type="button" class="ajaxbutton" id="update-region-status" value="Update">
                    <input type="hidden" id="delegate-nation" value="N/A">
                    <input type="button" class="ajaxbutton nation-action-button" id="endorse-delegate" value="Endorse Delegate">
                    <input type="button" id="copy-win" value="Copy Win">
                    <input type="button" id="copy-orders" value="Copy Orders">
                    <input type="button" id="open-region" value="Open">
                </div>
                <!-- Current Region Happenings -->
                <div id="current-region-happenings-container">
                    <span class="header"><span class="ns-heading-icon icon-happenings"></span>Region Happenings</span>
                    <ul class="information" id="region-happenings">
                    </ul>
                </div>
            </div>
            <div id="group-5">
                <!-- Chasing -->
                <div id="chasing-container">
                    <span id="chasing-header" class="header"><span class="ns-heading-icon icon-chasing"></span>Chasing</span>
                    <span id="sse-status" style="float: right; font-size: 0.9em; color: #999;">Connecting...</span>
                    <div id="chasing-actions-row">
                        <input type="button" id="chasing-button" value="Refresh" class="ajaxbutton button-success">
                        <input type="button" id="move-to-jp" value="Move to JP" class="ajaxbutton nation-action-button">
                    </div>
                    <ul id="reports" class="information">
                    </ul>
                    <div id="occupation-mode-row">
                        <span class="subheader">Occupation Mode</span>
                        <span class="information" id="occupation-status">Disabled</span>
                        <span class="subheader occupation-sequence-display hidden">Sequence</span>
                        <span class="information occupation-sequence-display hidden" id="occupation-sequence">Ready</span>
                    </div>
                </div>
            </div>
            <div id="group-3">
                <!-- Endorsing -->
                <div id="endorse-container">
                    <span id="endorse-header" class="header"><span class="ns-heading-icon icon-endorse"></span>Endorse</span>
                    <div class="buttonblock">
                        <input type="button" id="refresh-endorse" value="Refresh" class="ajaxbutton">
                    </div>
                    <div class="buttonblock">
                        <input type="text" id="manual-endorse-nation" placeholder="nation_name">
                        <input type="button" id="manual-endorse" value="Endorse" class="ajaxbutton nation-action-button endorse" data-updatedlocalid="1">
                    </div>
                    <ul class="information" id="nations-to-endorse">
                    </ul>
                </div>
                <!-- Dossier -->
                <div id="dossier-container">
                    <span id="dossier-header" class="header"><span class="ns-heading-icon icon-dossier"></span>Dossier</span>
                    <div class="buttonblock">
                        <input type="button" id="refresh-dossier" value="Refresh" class="ajaxbutton">
                        <label for="raider-jp">Raider Jump Point</label>
                        <input type="text" id="raider-jp">
                        <input type="button" id="set-raider-jp" value="Set">
                    </div>
                    <div class="buttonblock">
                        <span class="subheader">Tracked Nations</span>
                        <input type="text" id="manual-dossier-nation" placeholder="nation_name">
                        <input type="button" id="add-manual-dossier-nation" value="Add">
                    </div>
                    <ul class="information" id="tracked-dossier-nations">
                    </ul>
                    <ul class="information" id="nations-to-dossier">
                    </ul>
                </div>
            </div>
            <div id="group-4">
                <!-- JP Happenings -->
                <div id="jp-happenings-container">
                    <span class="header"><span class="ns-heading-icon icon-jp"></span>JP Happenings</span>
                    <ul class="information" id="jp-happenings">
                    </ul>
                </div>
                <!-- Raider Happenings -->
                <div id="raider-happenings-container">
                    <span class="header"><span class="ns-heading-icon icon-raider"></span>Raider Happenings</span>
                    <ul class="information" id="raider-happenings">
                    </ul>
                </div>
            </div>
            <div id="group-6">
                <!-- Did I Update? -->
                <div id="did-i-update-container">
                    <span class="header"><span class="ns-heading-icon icon-status"></span>Did I Update?</span>
                    <input type="button" class="ajaxbutton" id="check-if-updated" value="Did I Update?">
                    <div class="information">
                        <ul id="did-i-update">
                        </ul>
                    </div>
                </div>
                <!-- World Happenings-->
                <div id="world-happenings-container">
                    <span class="header" id="world-happenings-header"><span class="ns-heading-icon icon-world"></span>World Happenings</span>
                    <input type="button" class="ajaxbutton" id="update-world-happenings" value="Update">
                    <ul class="information" id="world-happenings">
                    </ul>
                </div>
            </div>
            <div id="group-7">
                <div id="update-predictor-container">
                    <span class="header"><span class="ns-heading-icon icon-predictor"></span>Update Predictor</span>
                    <div class="buttonblock">
                        <label for="update-predictor-region">Region</label>
                        <input type="text" id="update-predictor-region" placeholder="region_name">
                        <input type="button" id="set-update-predictor-region" value="Set">
                        <input type="button" id="refresh-update-predictor-dump" value="Refresh Dump">
                        <input type="button" id="update-localid-update-predictor" value="Update Localid">
                        <input type="button" id="move-to-update-predictor-region" value="Move to Region" class="nation-action-button">
                        <span id="update-predictor-trigger-countdown" class="update-predictor-trigger-countdown hidden"></span>
                        <br>
                        <div id="update-predictor-endorse-row">
                            <label for="update-predictor-endorse-nation">Endorse</label>
                            <input type="text" id="update-predictor-endorse-nation" placeholder="nation_name">
                            <input type="button" id="update-predictor-endorse" value="Endorse" class="ajaxbutton nation-action-button">
                        </div>
                        <label for="update-predictor-trigger-seconds">Trigger (seconds)</label>
                        <input type="text" id="update-predictor-trigger-seconds" value="10">
                        <input type="button" id="set-update-predictor-trigger-seconds" value="Set">
                    </div>
                    <div id="update-predictor-earlier-container">
                        <span class="subheader">Earlier Regions</span>
                        <div id="update-predictor-earlier-wheel" class="information">
                            <div id="update-predictor-earlier-empty">Select a region to see earlier candidates.</div>
                            <div id="update-predictor-earlier-items"></div>
                        </div>
                    </div>
                    <div id="update-predictor-grid" class="information">
                        <div class="update-predictor-metric">
                            <span class="subheader">Status</span>
                            <span id="update-predictor-cycle">N/A</span>
                        </div>
                        <div class="update-predictor-metric">
                            <span class="subheader">Target</span>
                            <span id="update-predictor-order">N/A</span>
                        </div>
                        <div class="update-predictor-metric">
                            <span class="subheader">Regions Left</span>
                            <span id="update-predictor-regions-left">N/A</span>
                        </div>
                        <div class="update-predictor-metric">
                            <span class="subheader">Last Time</span>
                            <span id="update-predictor-eta">N/A</span>
                        </div>
                    </div>
                    <span id="update-predictor-status" class="information">Choose a region to track.</span>
                </div>
            </div>
        </div>
    </body>
</html>
`;
    // Initiate SSE connection
    const raiderJp = await getStorageValue('raiderjp');
    const SHARED_REGIONS_DUMP_CACHE_KEY = 'regionsXmlDumpCacheV1';
    const UPDATE_PREDICTOR_REGION_KEY = 'updatePredictorRegion';
    const UPDATE_PREDICTOR_ALERT_SECONDS_KEY = 'updatePredictorAlertSeconds';
    const UPDATE_PREDICTOR_MINOR_ANCHOR = 1776960000;
    const UPDATE_PREDICTOR_MAJOR_ANCHOR = 1777003200;
    const UPDATE_PREDICTOR_CYCLE_SECONDS = 24 * 60 * 60;
    const UPDATE_PREDICTOR_STALE_CACHE_MS = 30 * 60 * 60 * 1000;
    const UPDATE_PREDICTOR_DEFAULT_ALERT_SECONDS_THRESHOLD = 10;
    const UPDATE_PREDICTOR_EARLIER_MIN_ROWS = 10;
    const UPDATE_PREDICTOR_EARLIER_MAX_NEARBY_SECONDS = 10;
    const UPDATE_PREDICTOR_EARLIER_PREVIEW_MS = 1000;
    const UPDATE_PREDICTOR_SSE_GRACE_MS = 60 * 1000;
    const UPDATE_PREDICTOR_MAX_ACTIVE_SECONDS = 3 * 60 * 60;
    const CHASE_DESTINATION_MAX_DUMP_UPDATE_GAP_SECONDS = 5 * 60;
    let updatePredictorDumpCache = null;
    let updatePredictorRegionKey = canonicalize(await getStorageValue(UPDATE_PREDICTOR_REGION_KEY) || '');
    let updatePredictorLiveCycleStart = 0;
    let updatePredictorLiveRegions = new Set();
    let updatePredictorLiveCursorKey = '';
    let updatePredictorLiveCursorTime = 0;
    let updatePredictorLiveStateStartedAt = 0;
    let updatePredictorTimeAlertKey = '';
    let updatePredictorAlertSecondsThreshold = Number(await getStorageValue(UPDATE_PREDICTOR_ALERT_SECONDS_KEY))
        || UPDATE_PREDICTOR_DEFAULT_ALERT_SECONDS_THRESHOLD;
    let updatePredictorEarlierCandidateRows = [];
    let updatePredictorEarlierCenteredIndex = -1;
    let updatePredictorEarlierSignature = '';
    let updatePredictorEarlierPreviewTimeout = null;
    // Event patterns configuration
    const eventPatterns = {
        RELOCATION: {
            regex: /@@([^@]+)@@ relocated from %%([^%]+)%% to %%([^%]+)%%/,
            format: (matches) => formatLink(matches[1], 'nation') +
                ` moved from ${formatLink(matches[2], 'region')} to ${formatLink(matches[3], 'region')}`,
            handler: async (matches) => {
                const jumpPoint = canonicalize(await getStorageValue('jumppoint') || '');
                const destinationRegion = canonicalize(matches[3] || '');
                if (jumpPoint && destinationRegion === jumpPoint) {
                    return;
                }
                // (document.querySelector('#chasing-button') as HTMLInputElement).setAttribute('data-moveregion', matches[3]);
                await playMoveSuccessSound();
            }
        },
        ADMISSION: {
            regex: /@@([^@]+)@@ was admitted to the World Assembly/,
            format: (matches) => `${formatLink(matches[1], 'nation')} was admitted to the World Assembly`
        },
        ENDORSEMENT: {
            regex: /@@([^@]+)@@ endorsed @@([^@]+)@@/,
            format: (matches) => `${formatLink(matches[1], 'nation')} endorsed ${formatLink(matches[2], 'nation')}`
        },
        WITHDRAW_ENDORSEMENT: {
            regex: /@@([^@]+)@@ withdrew its endorsement from @@([^@]+)@@/,
            format: (matches) => `${formatLink(matches[1], 'nation')} withdrew its endorsement from ${formatLink(matches[2], 'nation')}`
        },
        RESIGN_WA: {
            regex: /@@([^@]+)@@ resigned from the World Assembly/,
            format: (matches) => `${formatLink(matches[1], 'nation')} resigned from the World Assembly`
        },
        INFLUENCE: {
            regex: /@@([^@]+)@@'s influence in %%([^@]+)%% rose from "[^@]+" to "[^@]+"/,
            format: (matches) => `${formatLink(matches[1], 'nation')} updated in ${formatLink(matches[2], 'region')}`,
            handler: async (matches, data) => {
                recordUpdatePredictorSSE(matches[2], Number(data.time));
                // Check if this is the current WA nation updating
                const updatedNation = matches[1];
                const currentWA = await getStorageValue('currentwa');
                if (currentWA && canonicalize(updatedNation) === canonicalize(currentWA)) {
                    // Highlight the current WA nation element
                    const currentWAElement = document.querySelector('#current-wa-nation');
                    if (currentWAElement) {
                        // Remove any existing highlights first
                        currentWAElement.classList.remove('highlight-active', 'highlight-na');
                        // Add red pulse animation
                        currentWAElement.classList.add('highlight-update');
                        // After animation, switch to green highlight
                        setTimeout(() => {
                            currentWAElement.classList.remove('highlight-update');
                            currentWAElement.classList.add('highlight-active');
                        }, 2000); // Match the pulse animation duration
                    }
                }
            }
        },
        WA_DELEGATE: {
            regex: /@@([^@]+)@@ became WA Delegate of %%([^%]+)%%/,
            format: (matches) => `${formatLink(matches[1], 'nation')} became WA Delegate of ${formatLink(matches[2], 'region')}`
        }
    };
    // Helper function to create links
    const formatLink = (text, type) => {
        return `<a href="/${type}=${text}">${text}</a>`;
    };
    // Track timeout for N/A highlighting
    let naHighlightTimeout = null;
    // Helper function to handle WA nation display highlighting
    const updateWANationDisplay = (element, value) => {
        element.innerHTML = value;
        // Clear any existing timeout
        if (naHighlightTimeout) {
            clearTimeout(naHighlightTimeout);
            naHighlightTimeout = null;
        }
        // Remove all highlight classes first
        element.classList.remove('highlight-update', 'highlight-na', 'highlight-active');
        // Add highlight-na class if value is N/A, but with a 5-second delay
        if (value === 'N/A' || !value) {
            naHighlightTimeout = setTimeout(() => {
                // Check if the value is still N/A after the delay
                if (element.innerHTML === 'N/A' || !element.innerHTML) {
                    element.classList.add('highlight-na');
                }
            }, 5000);
        }
    };
    // Helper function to append report
    const appendReport = (content, timestamp) => {
        const reportsElement = document.querySelector('#reports');
        if (reportsElement) {
            const liElement = document.createElement('li');
            liElement.innerHTML = timestamp ? `${formatReliantClickableTime(timestamp)}: ${content}` : content;
            reportsElement.prepend(liElement);
            return liElement;
        }
    };
    const seenSSEEventKeys = new Set();
    const seenSSEEventQueue = [];
    const MAX_SEEN_SSE_EVENTS = 500;
    function getSSEEventKey(data) {
        return `${Number(data.time)}:${data.str}`;
    }
    function hasSeenSSEEvent(data) {
        const eventKey = getSSEEventKey(data);
        if (seenSSEEventKeys.has(eventKey)) {
            return true;
        }
        seenSSEEventKeys.add(eventKey);
        seenSSEEventQueue.push(eventKey);
        while (seenSSEEventQueue.length > MAX_SEEN_SSE_EVENTS) {
            seenSSEEventKeys.delete(seenSSEEventQueue.shift());
        }
        return false;
    }
    // Main event handler
    const handleEventMessage = async (event) => {
        try {
            const data = JSON.parse(event.data);
            if (hasSeenSSEEvent(data)) {
                return;
            }
            // Try each pattern until we find a match
            for (const [patternKey, pattern] of Object.entries(eventPatterns)) {
                const match = data.str.match(pattern.regex);
                if (match) {
                    // Push SSE events directly into happenings lists to avoid API refresh flicker.
                    let eventFormatted = formatApiString(data.str);
                    const eventRegions = extractEventRegions(data.str);
                    const [jumpPoint, raiderJumpPoint, currentWA, trackedNationsFromStorage] = await Promise.all([
                        getStorageValue('jumppoint'),
                        getStorageValue('raiderjp'),
                        getStorageValue('currentwa'),
                        getStorageValue('trackednations')
                    ]);
                    const currentRegionName = canonicalize(document.querySelector('#current-region')?.innerHTML || '');
                    const jpRegion = canonicalize(jumpPoint || '');
                    const raiderRegion = canonicalize(raiderJumpPoint || '');
                    const raiderTrackingRegions = await getRaiderTrackingRegionKeys(jpRegion);
                    const predictorRegion = updatePredictorRegionKey;
                    const trackedNations = (trackedNationsFromStorage || []).map((nation) => canonicalize(nation));
                    const visibleRegions = [jpRegion, raiderRegion, currentRegionName, predictorRegion, ...raiderTrackingRegions]
                        .filter((region) => region && region !== 'n/a');
                    const visibleNations = [canonicalize(currentWA || ''), ...trackedNations]
                        .filter((nation) => nation && nation !== 'n/a');
                    const eventTime = Number(data.time);
                    const suppressChaseAction = patternKey === 'RELOCATION' &&
                        await shouldSuppressChaseDestination(match[3]);
                    const eventRaiderRegion = getEventRaiderRegion(data, raiderTrackingRegions);
                    if (eventRaiderRegion) {
                        eventFormatted = formatHappeningWithBucketRegion(eventFormatted, eventRegions, eventRaiderRegion);
                    }
                    if (patternKey === 'ADMISSION' && eventRaiderRegion) {
                        await trackRaiderNation(match[1], eventRaiderRegion, false);
                    }
                    if (patternKey === 'ENDORSEMENT' && eventRaiderRegion) {
                        await trackRaiderNation(match[2], eventRaiderRegion, false);
                    }
                    // Move region handler
                    if (!suppressChaseAction && pattern.handler) {
                        await pattern.handler(match, data);
                    }
                    const showEvent = shouldShowSSEEvent(patternKey, data.str, eventRegions, visibleRegions, visibleNations);
                    if (!showEvent) {
                        return;
                    }
                    const shouldDisplayInReports = patternKey !== 'ENDORSEMENT' &&
                        patternKey !== 'WITHDRAW_ENDORSEMENT';
                    const reportElement = shouldDisplayInReports ? appendReport(pattern.format(match), eventTime) : null;
                    if (reportElement && patternKey === 'RELOCATION') {
                        await refreshChaseReportHighlights();
                    }
                    if (jpRegion && eventMatchesRegion(data, eventRegions, jpRegion)) {
                        await appendSSEHappening('#jp-happenings', eventFormatted, eventTime, data.str);
                        await updateEndorsePanelFromJpEvent(patternKey, match);
                    }
                    if (raiderRegion && raiderRegion !== jpRegion && eventMatchesRegion(data, eventRegions, raiderRegion)) {
                        await appendSSEHappening('#raider-happenings', eventFormatted, eventTime, data.str);
                    }
                    else if (eventRaiderRegion) {
                        await appendSSEHappening('#raider-happenings', eventFormatted, eventTime, data.str);
                    }
                    if (currentRegionName && currentRegionName !== 'n/a' && eventMatchesRegion(data, eventRegions, currentRegionName)) {
                        await appendSSEHappening('#region-happenings', eventFormatted, eventTime, data.str);
                    }
                    updateReliantClickableTimes();
                    const sseTimeout = Number(await getStorageValue('ssetimeout')) * 1000;
                    if (reportElement && sseTimeout) {
                        setTimeout(() => {
                            document.querySelector('#reports').removeChild(reportElement);
                        }, sseTimeout);
                    }
                    else if (reportElement) {
                        // Arbitrary default timeout
                        setTimeout(() => {
                            document.querySelector('#reports').removeChild(reportElement);
                        }, 10000);
                    }
                    return;
                }
            }
            // Log unmatched patterns for debugging
            console.log('Unmatched event:', data.str);
        }
        catch (error) {
            console.error('Error processing event:', error);
        }
    };
    // SSE connection management variables
    let eventSource;
    let sseReconnectTimeout = null;
    let sseReconnectDelay = 1000; // Start with 1 second delay
    let sseConnectionRetries = 0;
    const MAX_SSE_RETRIES = 5;
    const SSE_DEBOUNCE_DELAY = 2000; // 2 second debounce for reconnections
    async function buildSSEUrl(trackedNationsOverride) {
        const [myNation, trackedNationsFromStorage, jumpPoint, raiderJumpPoint, updatePredictorRegion] = await Promise.all([
            getStorageValue('currentwa'),
            getStorageValue('trackednations'),
            getStorageValue('jumppoint'),
            getStorageValue('raiderjp'),
            getStorageValue(UPDATE_PREDICTOR_REGION_KEY)
        ]);
        const trackedNations = trackedNationsOverride ?? trackedNationsFromStorage ?? [];
        const myRegion = canonicalize(document.querySelector('#current-region')?.innerHTML || '');
        const jpRegion = canonicalize(jumpPoint || '');
        const raiderRegion = canonicalize(raiderJumpPoint || '');
        const raiderTrackingRegions = await getRaiderTrackingRegionKeys(jpRegion);
        const buckets = new Set();
        buckets.add(`nation:${myNation || 'haku'}`);
        if (trackedNations.length > 0)
            trackedNations.forEach((nation) => buckets.add(`nation:${nation}`));
        if (jpRegion)
            buckets.add(`region:${jpRegion}`);
        if (raiderRegion && raiderRegion !== jpRegion)
            buckets.add(`region:${raiderRegion}`);
        raiderTrackingRegions.forEach((region) => buckets.add(`region:${region}`));
        if (myRegion && myRegion !== 'n/a')
            buckets.add(`region:${myRegion}`);
        if (updatePredictorRegion) {
            buckets.add('change');
            buckets.add(`region:${canonicalize(updatePredictorRegion)}`);
        }
        return `/api/${Array.from(buckets).join('+')}`;
    }
    async function appendSSEHappening(listSelector, formattedText, timestamp, sourceText = '') {
        const list = document.querySelector(listSelector);
        if (!list)
            return;
        const li = document.createElement('li');
        li.innerHTML = `${formatReliantClickableTime(timestamp)}: ${formattedText}`;
        await decorateHappeningRegionLinks(li, sourceText);
        prependHappeningPreservingViewport(list, li);
    }
    function prependHappeningPreservingViewport(list, item) {
        // Keep users anchored to "now" when near the top, but preserve reading position when scrolled down.
        const wasNearTop = list.scrollTop <= 16;
        const previousHeight = list.scrollHeight;
        const previousScrollTop = list.scrollTop;
        list.prepend(item);
        if (wasNearTop) {
            list.scrollTop = 0;
            return;
        }
        const heightDelta = list.scrollHeight - previousHeight;
        list.scrollTop = previousScrollTop + heightDelta;
    }
    function normalizeEventBucket(bucket) {
        const separatorIndex = bucket.indexOf(':');
        if (separatorIndex === -1) {
            return canonicalize(bucket);
        }
        const bucketType = canonicalize(bucket.slice(0, separatorIndex));
        const bucketValue = canonicalize(bucket.slice(separatorIndex + 1));
        return `${bucketType}:${bucketValue}`;
    }
    function getEventBuckets(data) {
        return new Set((data.buckets || []).map(normalizeEventBucket));
    }
    function eventMatchesRegion(data, eventRegions, region) {
        const eventBuckets = getEventBuckets(data);
        if (eventBuckets.size > 0) {
            return eventBuckets.has(`region:${region}`);
        }
        return eventRegions.includes(region);
    }
    async function getRaiderTrackingRegionKeys(jumpPointOverride) {
        const [blockedRegions, storedJumpPoint, storedRaiderJumpPoint] = await Promise.all([
            getStorageValue('blockedregions'),
            getStorageValue('jumppoint'),
            getStorageValue('raiderjp')
        ]);
        const jumpPoint = canonicalize(jumpPointOverride || storedJumpPoint || '');
        const raiderJumpPoint = canonicalize(storedRaiderJumpPoint || '');
        const regionKeys = new Set();
        (blockedRegions || []).forEach((region) => {
            const regionKey = canonicalize(region);
            if (regionKey && regionKey !== jumpPoint) {
                regionKeys.add(regionKey);
            }
        });
        if (raiderJumpPoint && raiderJumpPoint !== jumpPoint) {
            regionKeys.add(raiderJumpPoint);
        }
        return Array.from(regionKeys);
    }
    function getEventRaiderRegion(data, raiderRegionKeys) {
        const eventBuckets = getEventBuckets(data);
        for (const regionKey of raiderRegionKeys) {
            if (eventBuckets.has(`region:${regionKey}`)) {
                return regionKey;
            }
        }
        return null;
    }
    function formatHappeningWithBucketRegion(formattedText, eventRegions, regionKey) {
        if (!regionKey || eventRegions.length > 0) {
            return formattedText;
        }
        if (formattedText.includes(' was admitted to the World Assembly')) {
            return formattedText.replace(' was admitted to the World Assembly', ` (${formatLink(regionKey, 'region')}) was admitted to the World Assembly`);
        }
        const firstNationLink = formattedText.match(/<a href=['"]\/nation=[^'"]+['"]>[^<]+<\/a>/);
        if (!firstNationLink) {
            return formattedText;
        }
        return formattedText.replace(firstNationLink[0], `${firstNationLink[0]} (${formatLink(regionKey, 'region')})`);
    }
    function getHappeningRegionFromText(eventText, raiderRegionKeys) {
        const eventRegions = extractEventRegions(eventText);
        const matchingRegion = eventRegions.find((region) => raiderRegionKeys.includes(region));
        if (matchingRegion) {
            return matchingRegion;
        }
        return raiderRegionKeys.length === 1 ? raiderRegionKeys[0] : '';
    }
    function getRegionLinkKey(anchor) {
        const hrefMatch = anchor.getAttribute('href')?.match(/region=([^?#]+)/);
        const regionName = hrefMatch ? hrefMatch[1] : anchor.textContent || '';
        return canonicalize(decodeURIComponent(regionName));
    }
    function getMoveDestinationFromHappeningText(eventText) {
        const rawMatch = eventText.match(/@@[^@]+@@ relocated from %%[^%]+%% to %%([^%]+)%%/);
        if (rawMatch) {
            return canonicalize(rawMatch[1]);
        }
        const formattedMatch = eventText.match(/moved from .*? to ([^<]+)/);
        return formattedMatch ? canonicalize(formattedMatch[1]) : '';
    }
    async function decorateHappeningRegionLinks(item, sourceText) {
        const anchors = Array.from(item.querySelectorAll('a[href*="region="]'));
        if (anchors.length === 0) {
            return;
        }
        const blockedRegionKeys = await getBlockedRegionKeys();
        const jumpPoint = canonicalize(await getStorageValue('jumppoint') || '');
        const moveDestination = getMoveDestinationFromHappeningText(sourceText || item.textContent || '');
        const chaseableDestination = moveDestination ?
            await isChaseableDestination(moveDestination, blockedRegionKeys) :
            false;
        anchors.forEach((anchor) => {
            const regionKey = getRegionLinkKey(anchor);
            const blocked = Boolean(regionKey && regionKey !== jumpPoint && blockedRegionKeys.has(regionKey));
            anchor.classList.toggle('blocked-region-destination', blocked);
            anchor.classList.toggle('chaseable-region-destination', chaseableDestination && regionKey === moveDestination);
        });
    }
    async function trackRaiderNation(nationName, regionKey, announce = true) {
        const nationKey = canonicalize(nationName || '');
        if (!nationKey) {
            return;
        }
        const trackedNations = await getStorageValue('trackednations') || [];
        if (trackedNations.includes(nationKey)) {
            return;
        }
        trackedNations.push(nationKey);
        await setStorageValue('trackednations', trackedNations);
        if (announce) {
            status.innerHTML = regionKey ? `Tracking ${nationKey} from ${regionKey}.` : `Tracking ${nationKey}.`;
        }
    }
    function extractEventRegions(eventText) {
        const regions = [];
        const regionMatches = eventText.match(/%%([^%]+)%%/g) || [];
        for (const match of regionMatches) {
            regions.push(canonicalize(match.replace(/%/g, '')));
        }
        return regions;
    }
    function extractEventNations(eventText) {
        const nations = [];
        const nationMatches = eventText.match(/@@([^@]+)@@/g) || [];
        for (const match of nationMatches) {
            nations.push(canonicalize(match.replace(/@/g, '')));
        }
        return nations;
    }
    function shouldShowSSEEvent(patternKey, eventText, eventRegions, visibleRegions, visibleNations) {
        if (patternKey !== 'INFLUENCE')
            return true;
        const eventNations = extractEventNations(eventText);
        return eventRegions.some((region) => visibleRegions.includes(region)) ||
            eventNations.some((nation) => visibleNations.includes(nation));
    }
    // Helper function to create SSE connection with retry logic
    function createSSEConnection(url) {
        // Close existing connection if any
        if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
            eventSource.close();
        }
        eventSource = new EventSource(url);
        eventSource.onmessage = handleEventMessage;
        eventSource.onopen = () => {
            console.log('SSE connection opened');
            // Reset retry counters on successful connection
            sseConnectionRetries = 0;
            sseReconnectDelay = 1000;
            // Update SSE status indicator
            const sseStatusElement = document.querySelector('#sse-status');
            if (sseStatusElement) {
                sseStatusElement.innerHTML = 'Connected';
                sseStatusElement.style.color = '#4CAF50';
            }
            // Clear any error status
            const currentStatus = status.innerHTML;
            if (currentStatus.includes('SSE connection') || currentStatus.includes('Retrying')) {
                status.innerHTML = 'Connected to live updates.';
            }
        };
        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            // Update SSE status indicator
            const sseStatusElement = document.querySelector('#sse-status');
            if (sseStatusElement) {
                sseStatusElement.innerHTML = 'Disconnected';
                sseStatusElement.style.color = '#f44336';
            }
            // Check if connection is closed (likely due to 429 or network error)
            if (eventSource.readyState === EventSource.CLOSED) {
                if (sseConnectionRetries < MAX_SSE_RETRIES) {
                    sseConnectionRetries++;
                    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
                    const delay = Math.min(sseReconnectDelay * Math.pow(2, sseConnectionRetries - 1), 30000);
                    console.log(`SSE connection failed. Retrying in ${delay / 1000}s (attempt ${sseConnectionRetries}/${MAX_SSE_RETRIES})`);
                    // Update status indicator with retry info
                    if (sseStatusElement) {
                        sseStatusElement.innerHTML = `Retry in ${delay / 1000}s`;
                        sseStatusElement.style.color = '#FFC107';
                    }
                    // Only show status if it's taking longer than expected
                    if (sseConnectionRetries > 1) {
                        status.innerHTML = `Reconnecting to updates in ${delay / 1000}s...`;
                    }
                    setTimeout(() => {
                        console.log(`Retrying SSE connection (attempt ${sseConnectionRetries})`);
                        if (sseStatusElement) {
                            sseStatusElement.innerHTML = 'Reconnecting...';
                            sseStatusElement.style.color = '#FF9800';
                        }
                        createSSEConnection(url);
                    }, delay);
                }
                else {
                    status.innerHTML = 'Connection limit reached. Wait 30s before tracking more nations.';
                    if (sseStatusElement) {
                        sseStatusElement.innerHTML = 'Rate limited';
                        sseStatusElement.style.color = '#9E9E9E';
                    }
                    // Reset after 30 seconds
                    setTimeout(() => {
                        sseConnectionRetries = 0;
                        createSSEConnection(url);
                    }, 30000);
                }
            }
        };
        console.log(`New SSE url: ${url}`);
    }
    // Set up initial event source
    if (typeof EventSource !== 'undefined') {
        const url = await buildSSEUrl();
        createSSEConnection(url);
    }
    else {
        console.error('EventSource is not supported in this browser');
    }
    document.open();
    document.write(pageContent);
    document.close();
    reliantClickableTimesInitialized = false;
    ensureReliantClickableTimes();
    function isNationStatesLink(anchor) {
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.toLowerCase().startsWith('javascript:')) {
            return false;
        }
        try {
            const url = new URL(href, window.location.href);
            return url.hostname === 'nationstates.net' || url.hostname.endsWith('.nationstates.net');
        }
        catch {
            return false;
        }
    }
    function openNationStatesAnchorInNewTab(anchor) {
        if (!isNationStatesLink(anchor)) {
            return;
        }
        anchor.target = '_blank';
        ['noopener', 'noreferrer'].forEach((relValue) => anchor.relList.add(relValue));
    }
    function openNationStatesLinksInNewTabs(root = document) {
        if (root instanceof HTMLAnchorElement) {
            openNationStatesAnchorInNewTab(root);
        }
        root.querySelectorAll('a[href]').forEach((anchor) => {
            openNationStatesAnchorInNewTab(anchor);
        });
    }
    openNationStatesLinksInNewTabs();
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.target instanceof HTMLAnchorElement) {
                openNationStatesAnchorInNewTab(mutation.target);
                return;
            }
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement || node instanceof DocumentFragment) {
                    openNationStatesLinksInNewTabs(node);
                }
            });
        });
    }).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
    });
    const REGION_UPDATE_BUTTON_STATES = {
        update: {
            label: 'Update',
            icon: '\ue82d',
            nationAction: false
        },
        dismissRo: {
            label: 'Dismiss RO',
            icon: '\ue835',
            nationAction: true
        },
        appointSelfRo: {
            label: 'Appoint Self as RO',
            icon: '\ue836',
            nationAction: true
        }
    };
    function decorateButtonWithIcon(buttonId, icon) {
        const button = document.querySelector(`#${buttonId}`);
        if (!button || button.type !== 'button') {
            return;
        }
        const trimmedValue = getReliantButtonLabel(button);
        if (!trimmedValue || trimmedValue.startsWith(icon)) {
            return;
        }
        setReliantButtonLabel(button, `${icon} ${trimmedValue}`);
        button.classList.add('ns-icon-button');
    }
    function applyButtonIcons() {
        const iconByButtonId = {
            'update-localid': '\ue80d',
            'resign': '\ue819',
            'admit': '\ue802',
            'copy-nation-link': '\ue842',
            'update-region-status': REGION_UPDATE_BUTTON_STATES.update.icon,
            'endorse-delegate': '\ue815',
            'copy-win': '\ue842',
            'copy-orders': '\ue842',
            'open-region': '\ue811',
            'move-to-jp': '\ue83c',
            'chasing-button': '\ue82d',
            'refresh-endorse': '\ue82d',
            'manual-endorse': '\ue815',
            'refresh-dossier': '\ue82d',
            'set-raider-jp': '\ue80d',
            'add-manual-dossier-nation': '\ue82f',
            'check-if-updated': '\ue82d',
            'update-world-happenings': '\ue82d',
            'set-update-predictor-region': '\ue80d',
            'set-update-predictor-trigger-seconds': '\ue80d',
            'refresh-update-predictor-dump': '\ue82d',
            'update-localid-update-predictor': '\ue80d',
            'move-to-update-predictor-region': '\ue806',
            'update-predictor-endorse': '\ue815'
        };
        for (const [buttonId, icon] of Object.entries(iconByButtonId)) {
            decorateButtonWithIcon(buttonId, icon);
        }
    }
    applyButtonIcons();
    const mainPageKeyDisplayBindings = [
        { selector: '#update-region-status', keySetting: 'refreshkey', defaultKey: 'C' },
        { selector: '#move-to-jp', keySetting: 'jpkey', defaultKey: 'V' },
        { selector: '#chasing-button', keySetting: 'movekey', defaultKey: 'X' },
        { selector: '#open-region', keySetting: 'viewregionkey', defaultKey: 'D' },
        { selector: '#check-if-updated', keySetting: 'didiupdatekey', defaultKey: 'U' },
        { selector: '#endorse-delegate', keySetting: 'delegatekey', defaultKey: 'A' },
        { selector: '#update-world-happenings', keySetting: 'worldactivitykey', defaultKey: 'F' },
    ];
    const conditionalMainPageKeyDisplaySelectors = [
        '#resign',
        '#admit',
        '#refresh-endorse',
        '.endorse',
        '#refresh-dossier',
        '.dossier',
        '#update-localid',
        '#move-to-update-predictor-region',
    ];
    async function getConditionalMainPageKeyDisplayBindings() {
        const currentWa = await getStorageValue('currentwa');
        const bindings = [];
        if (!freshlyAdmitted) {
            bindings.push({
                selector: currentWa ? '#resign' : '#admit',
                keySetting: 'resignkey',
                defaultKey: '\''
            });
        }
        const endorseButton = document.querySelector('.endorse[data-clicked="0"]');
        if (freshlyAdmitted) {
            bindings.push({ selector: '#update-localid', keySetting: 'endorsekey', defaultKey: 'Z' });
        }
        else {
            bindings.push({
                selector: endorseButton ? '.endorse[data-clicked="0"]' : '#refresh-endorse',
                keySetting: 'endorsekey',
                defaultKey: 'Z'
            });
        }
        const dossierButton = document.querySelector('.dossier[data-clicked="0"]');
        bindings.push({
            selector: dossierButton ? '.dossier[data-clicked="0"]' : '#refresh-dossier',
            keySetting: 'dossiernationkey',
            defaultKey: 'N'
        });
        if (moveToUpdatePredictorRegionButton?.dataset.updatePredictorTriggerActive === '1') {
            bindings.push({
                selector: '#move-to-update-predictor-region',
                keySetting: 'updatepredictormovekey',
                defaultKey: 'J'
            });
        }
        return bindings;
    }
    function refreshMainPageKeyDisplays() {
        clearReliantButtonKeyDisplays(conditionalMainPageKeyDisplaySelectors);
        void applyReliantButtonKeyDisplays(mainPageKeyDisplayBindings);
        void getConditionalMainPageKeyDisplayBindings()
            .then((bindings) => applyReliantButtonKeyDisplays(bindings));
    }
    refreshMainPageKeyDisplays();
    const DEFAULT_BACKGROUND_TINT = { color: '#0d1117', pageAmount: 0, panelAmount: 0, panelBlur: 0 };
    let savedAppearanceState = { backgroundTint: { ...DEFAULT_BACKGROUND_TINT } };
    let draftAppearanceState = { backgroundTint: { ...DEFAULT_BACKGROUND_TINT } };
    chrome.storage.local.get(['background', 'backgroundTint'], async (result) => {
        savedAppearanceState = readAppearanceState(result.background, result.backgroundTint);
        draftAppearanceState = cloneAppearanceState(savedAppearanceState);
        applyBackgroundCustomization(draftAppearanceState.background, draftAppearanceState.backgroundTint);
        updateAppearanceControls();
    });
    function normalizeBackgroundTint(backgroundTint) {
        return {
            color: typeof backgroundTint?.color === 'string' ? backgroundTint.color : DEFAULT_BACKGROUND_TINT.color,
            pageAmount: clampNumber(Number(backgroundTint?.pageAmount ?? DEFAULT_BACKGROUND_TINT.pageAmount), 0, 100),
            panelAmount: clampNumber(Number(backgroundTint?.panelAmount ?? DEFAULT_BACKGROUND_TINT.panelAmount), 0, 100),
            panelBlur: clampNumber(Number(backgroundTint?.panelBlur ?? DEFAULT_BACKGROUND_TINT.panelBlur), 0, 24),
        };
    }
    function readAppearanceState(background, backgroundTint) {
        return {
            background,
            backgroundTint: normalizeBackgroundTint(backgroundTint),
        };
    }
    function cloneAppearanceState(appearanceState) {
        return {
            background: appearanceState.background,
            backgroundTint: { ...appearanceState.backgroundTint },
        };
    }
    function clampNumber(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function hexToRgb(hex) {
        const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!match)
            return null;
        return {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16),
        };
    }
    function mixColors(base, tint, amount) {
        const baseRgb = hexToRgb(base);
        const tintRgb = hexToRgb(tint);
        if (!baseRgb || !tintRgb)
            return base;
        const ratio = clampNumber(amount, 0, 100) / 100;
        const r = Math.round(baseRgb.r + (tintRgb.r - baseRgb.r) * ratio);
        const g = Math.round(baseRgb.g + (tintRgb.g - baseRgb.g) * ratio);
        const b = Math.round(baseRgb.b + (tintRgb.b - baseRgb.b) * ratio);
        return `rgb(${r}, ${g}, ${b})`;
    }
    function rgba(hex, opacity) {
        const color = hexToRgb(hex);
        if (!color)
            return hex;
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${clampNumber(opacity, 0, 100) / 100})`;
    }
    function updateAppearanceControls() {
        const backgroundColorInput = document.querySelector('#appearance-background-color');
        const backgroundAmountInput = document.querySelector('#appearance-background-amount');
        const panelAmountInput = document.querySelector('#appearance-panel-amount');
        const panelBlurInput = document.querySelector('#appearance-panel-blur');
        const backgroundAmountOutput = document.querySelector('#appearance-background-amount-output');
        const panelAmountOutput = document.querySelector('#appearance-panel-amount-output');
        const panelBlurOutput = document.querySelector('#appearance-panel-blur-output');
        if (!backgroundColorInput || !backgroundAmountInput || !panelAmountInput || !panelBlurInput || !backgroundAmountOutput || !panelAmountOutput || !panelBlurOutput) {
            return;
        }
        backgroundColorInput.value = draftAppearanceState.backgroundTint.color;
        backgroundColorInput.disabled = draftAppearanceState.background !== undefined;
        backgroundAmountInput.value = String(draftAppearanceState.backgroundTint.pageAmount);
        panelAmountInput.value = String(draftAppearanceState.backgroundTint.panelAmount);
        panelBlurInput.value = String(draftAppearanceState.backgroundTint.panelBlur);
        backgroundAmountOutput.textContent = backgroundAmountInput.value;
        panelAmountOutput.textContent = panelAmountInput.value;
        panelBlurOutput.textContent = panelBlurInput.value;
    }
    function previewDraftAppearance() {
        applyBackgroundCustomization(draftAppearanceState.background, draftAppearanceState.backgroundTint);
        updateAppearanceControls();
    }
    function toggleAppearanceSettings() {
        const settings = document.querySelector('#appearance-settings');
        const opening = settings.classList.contains('hidden');
        if (opening) {
            draftAppearanceState = cloneAppearanceState(savedAppearanceState);
            previewDraftAppearance();
            settings.classList.remove('hidden');
            return;
        }
        draftAppearanceState = cloneAppearanceState(savedAppearanceState);
        previewDraftAppearance();
        settings.classList.add('hidden');
    }
    function updateDraftAppearanceFromInputs() {
        const backgroundColorInput = document.querySelector('#appearance-background-color');
        const backgroundAmountInput = document.querySelector('#appearance-background-amount');
        const panelAmountInput = document.querySelector('#appearance-panel-amount');
        const panelBlurInput = document.querySelector('#appearance-panel-blur');
        if (draftAppearanceState.background === undefined) {
            draftAppearanceState.backgroundTint.color = backgroundColorInput.value;
        }
        draftAppearanceState.backgroundTint.pageAmount = clampNumber(Number(backgroundAmountInput.value), 0, 100);
        draftAppearanceState.backgroundTint.panelAmount = clampNumber(Number(panelAmountInput.value), 0, 100);
        draftAppearanceState.backgroundTint.panelBlur = clampNumber(Number(panelBlurInput.value), 0, 24);
        previewDraftAppearance();
    }
    function loadDraftAppearanceImage(e) {
        const files = e.target.files;
        if (!files || files.length === 0)
            return;
        const reader = new FileReader();
        reader.onload = function () {
            draftAppearanceState.background = reader.result;
            previewDraftAppearance();
        };
        reader.readAsDataURL(files[0]);
    }
    function removeDraftAppearanceImage() {
        draftAppearanceState.background = undefined;
        const imageInput = document.querySelector('#appearance-background-image');
        imageInput.value = '';
        previewDraftAppearance();
    }
    async function saveDraftAppearance() {
        const savedTint = { ...draftAppearanceState.backgroundTint };
        await setStorageValue('backgroundTint', savedTint);
        if (draftAppearanceState.background === undefined) {
            await new Promise((resolve) => chrome.storage.local.remove('background', () => resolve()));
        }
        else {
            await setStorageValue('background', draftAppearanceState.background);
        }
        savedAppearanceState = cloneAppearanceState(draftAppearanceState);
        notyf.success('Saved appearance.');
    }
    function applyBackgroundCustomization(background, backgroundTint) {
        const body = document.querySelector('body');
        const configuredColor = typeof backgroundTint?.color === 'string' ? backgroundTint.color : '#0d1117';
        const tintColor = background !== undefined ? '#0d1117' : configuredColor;
        const pageTintAmount = Number(backgroundTint?.pageAmount ?? 0);
        const panelTintAmount = Number(backgroundTint?.panelAmount ?? 0);
        const panelBlur = clampNumber(Number(backgroundTint?.panelBlur ?? 0), 0, 24);
        const imageOverlayOpacity = 1 - (clampNumber(pageTintAmount, 0, 100) / 100);
        const imageOverlayRgb = { r: 13, g: 17, b: 23 };
        body.style.setProperty('--reliant-panel-backdrop-filter', panelBlur > 0 ? `blur(${panelBlur}px)` : 'none');
        body.style.backgroundColor = mixColors('#0d1117', tintColor, pageTintAmount);
        body.style.setProperty('--reliant-border-color', mixColors('#30363d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-border-muted-color', mixColors('#21262d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-panel-background', mixColors('#161b22', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-information-background', mixColors('#0d1117', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-input-background', mixColors('#0d1117', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-button-background', mixColors('#21262d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-button-hover-background', mixColors('#30363d', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-button-hover-border', mixColors('#8b949e', tintColor, panelTintAmount));
        body.style.setProperty('--reliant-disabled-background', mixColors('#21262d', tintColor, panelTintAmount));
        if (background !== undefined) {
            const panelOpacity = 100 - clampNumber(panelTintAmount, 0, 100);
            body.style.setProperty('--reliant-border-color', rgba('#30363d', panelOpacity));
            body.style.setProperty('--reliant-border-muted-color', rgba('#21262d', panelOpacity));
            body.style.setProperty('--reliant-panel-background', rgba('#161b22', panelOpacity));
            body.style.setProperty('--reliant-information-background', rgba('#0d1117', panelOpacity));
            body.style.setProperty('--reliant-input-background', rgba('#0d1117', panelOpacity));
            body.style.setProperty('--reliant-button-background', rgba('#21262d', panelOpacity));
            body.style.setProperty('--reliant-button-hover-background', rgba('#30363d', panelOpacity));
            body.style.setProperty('--reliant-button-hover-border', rgba('#8b949e', panelOpacity));
            body.style.setProperty('--reliant-disabled-background', rgba('#21262d', panelOpacity));
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center center';
            body.style.backgroundAttachment = 'fixed';
            body.style.backgroundImage =
                `linear-gradient(rgba(${imageOverlayRgb.r}, ${imageOverlayRgb.g}, ${imageOverlayRgb.b}, ${imageOverlayOpacity}), rgba(${imageOverlayRgb.r}, ${imageOverlayRgb.g}, ${imageOverlayRgb.b}, ${imageOverlayOpacity})), url("${background}")`;
        }
        else {
            body.style.backgroundImage = '';
            body.style.backgroundAttachment = '';
            body.style.backgroundPosition = '';
            body.style.backgroundRepeat = '';
            body.style.backgroundSize = '';
        }
    }
    await dieIfNoUserAgent();
    let notyf = new Notyf({
        duration: 3000,
        position: {
            x: 'right',
            y: 'top'
        }
    });
    /*
     * Dynamic Information
     */
    const status = document.querySelector('#status');
    const currentWANation = document.querySelector('#current-wa-nation');
    const nationsToEndorse = document.querySelector('#nations-to-endorse');
    const manualEndorseNationInput = document.querySelector('#manual-endorse-nation');
    const updatePredictorEndorseNationInput = document.querySelector('#update-predictor-endorse-nation');
    const nationsToDossier = document.querySelector('#nations-to-dossier');
    const trackedDossierNations = document.querySelector('#tracked-dossier-nations');
    const currentRegion = document.querySelector('#current-region');
    const didIUpdate = document.querySelector('#did-i-update');
    const regionHappenings = document.querySelector('#region-happenings');
    const worldHappenings = document.querySelector('#world-happenings');
    const updateRegionStatusButton = document.querySelector('#update-region-status');
    const updatePredictorRegionInput = document.querySelector('#update-predictor-region');
    const updatePredictorTriggerSecondsInput = document.querySelector('#update-predictor-trigger-seconds');
    const updatePredictorCycleElement = document.querySelector('#update-predictor-cycle');
    const updatePredictorOrderElement = document.querySelector('#update-predictor-order');
    const updatePredictorRegionsLeftElement = document.querySelector('#update-predictor-regions-left');
    const updatePredictorEtaElement = document.querySelector('#update-predictor-eta');
    const updatePredictorStatusElement = document.querySelector('#update-predictor-status');
    const moveToUpdatePredictorRegionButton = document.querySelector('#move-to-update-predictor-region');
    const updatePredictorTriggerCountdownElement = document.querySelector('#update-predictor-trigger-countdown');
    const updatePredictorEarlierWheelElement = document.querySelector('#update-predictor-earlier-wheel');
    const updatePredictorEarlierItemsElement = document.querySelector('#update-predictor-earlier-items');
    const updatePredictorEarlierEmptyElement = document.querySelector('#update-predictor-earlier-empty');
    /*
     * Things to keep track of
     */
    let nationsTracked = await getStorageValue('trackednations') || [];
    let nationsEndorsed = [];
    let regionalOfficersToDismiss = [];
    let secondRoAttempt = false;
    let lastMoveSoundTime = 0;
    let updatePredictorTriggerCountdownEndsAt = 0;
    let updatePredictorTriggerCountdownTimer = null;
    let updatePredictorMoveKeyActive = false;
    let chaseAssistStep = 'idle';
    let chaseAssistTargetRegion = '';
    let chaseAssistIdleBootstrappedThisSession = false;
    const CHASE_ASSIST_STATE_KEY = 'chaseAssistStateV1';
    function isCurrentRegionKnown() {
        const regionName = currentRegion.innerHTML.trim();
        return regionName !== '' && regionName !== 'N/A';
    }
    function setCurrentRegion(regionName) {
        currentRegion.innerHTML = regionName;
    }
    function resetRegionStatusDetails() {
        document.querySelector('#wa-delegate').innerHTML = 'N/A';
        document.querySelector('#last-wa-update').innerHTML = 'N/A';
    }
    function getDisplayedOccupationSequence() {
        return document.querySelector('#occupation-sequence')?.innerHTML || 'Ready';
    }
    function getChaseAssistState(sequence = getDisplayedOccupationSequence()) {
        return {
            sequence,
            step: chaseAssistStep,
            targetRegion: chaseAssistTargetRegion,
        };
    }
    async function persistChaseAssistState(sequence = getDisplayedOccupationSequence()) {
        await setStorageValue(CHASE_ASSIST_STATE_KEY, getChaseAssistState(sequence));
    }
    function applyChaseAssistState(savedState) {
        if (!savedState) {
            return;
        }
        chaseAssistStep = isChaseAssistStep(savedState.step) ? savedState.step : 'idle';
        chaseAssistTargetRegion = savedState.targetRegion || '';
        document.querySelector('#occupation-sequence').innerHTML = savedState.sequence || 'Ready';
    }
    function isChaseAssistStep(step) {
        const validSteps = [
            'idle',
            'jp-update-localid',
            'target-update-localid',
            'target-update-status',
            'target-endorse-delegate',
            'return-move-jp',
            'return-update-localid',
            'return-resign',
            'admit-next-switcher',
            'watching-stream',
            'endorsing-jp'
        ];
        return validSteps.includes(step);
    }
    async function restoreChaseAssistState() {
        const savedState = await getStorageValue(CHASE_ASSIST_STATE_KEY);
        if (savedState && typeof savedState === 'object') {
            applyChaseAssistState(savedState);
        }
    }
    function resetChaseAssistState(step = 'idle', sequence = 'Ready') {
        chaseAssistStep = step;
        chaseAssistTargetRegion = '';
        chaseAssistIdleBootstrappedThisSession = false;
        document.querySelector('#occupation-sequence').innerHTML = sequence;
    }
    function applyOperationMode(mode) {
        const normalizedMode = mode === 'raiding' ? 'raiding' : 'defending';
        document.body.classList.toggle('operation-mode-raiding', normalizedMode === 'raiding');
        document.body.classList.toggle('operation-mode-defending', normalizedMode === 'defending');
        refreshMainPageKeyDisplays();
    }
    function setUpdatePredictorMoveKeyActive(active) {
        if (updatePredictorMoveKeyActive === active)
            return;
        updatePredictorMoveKeyActive = active;
        moveToUpdatePredictorRegionButton.dataset.updatePredictorTriggerActive = active ? '1' : '0';
        refreshMainPageKeyDisplays();
    }
    async function submitMoveRegion(regionName) {
        const localId = await getStorageValue('localid');
        const formData = new FormData();
        formData.set('localid', localId);
        formData.set('region_name', regionName);
        formData.set('move_region', '1');
        const response = await makeAjaxQuery('/page=change_region', 'POST', formData);
        return response.indexOf('This request failed a security check.') === -1;
    }
    async function moveNationToRegion(regionName) {
        if (!(await submitMoveRegion(regionName))) {
            return false;
        }
        setCurrentRegion(regionName);
        return true;
    }
    async function submitEndorsement(nationName, localId) {
        const formData = new FormData();
        formData.set('nation', nationName);
        formData.set('localid', localId ?? await getStorageValue('localid'));
        formData.set('action', 'endorse');
        const response = await makeAjaxQuery('/cgi-bin/endorse.cgi', 'POST', formData, false, true);
        const redirectUrl = await getEndorseRedirectUrl(response.requestUserClick);
        if (response.text.indexOf('Failed security check.') !== -1) {
            return 'security-check-failed';
        }
        if (response.text.indexOf('Both nations must reside in the same region') !== -1) {
            return 'different-region';
        }
        if (response.redirectLocation.indexOf('err=endorse_region_mismatch') !== -1 ||
            response.responseUrl.indexOf('err=endorse_region_mismatch') !== -1 ||
            redirectUrl.indexOf('err=endorse_region_mismatch') !== -1) {
            return 'different-region';
        }
        if (response.redirectLocation.indexOf('err=non_un_endorse') !== -1 ||
            response.responseUrl.indexOf('err=non_un_endorse') !== -1 ||
            redirectUrl.indexOf('err=non_un_endorse') !== -1) {
            return 'non-wa-nation';
        }
        if (response.redirectLocation.indexOf('err=endorse_already_endorsed') !== -1 ||
            response.responseUrl.indexOf('err=endorse_already_endorsed') !== -1 ||
            redirectUrl.indexOf('err=endorse_already_endorsed') !== -1) {
            return 'already-endorsed';
        }
        if (response.status >= 300 && response.status < 400 && response.redirectLocation.indexOf('/page=error') !== -1) {
            return 'error-page-redirect';
        }
        if (response.redirected && response.responseUrl.indexOf('/page=error') !== -1) {
            return 'error-page-redirect';
        }
        if (redirectUrl.indexOf('/page=error') !== -1) {
            return 'error-page-redirect';
        }
        if (response.type === 'opaqueredirect' && !redirectUrl) {
            return 'error-page-redirect';
        }
        return 'endorsed';
    }
    async function getEndorseRedirectUrl(userClick) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: 'get-endorse-redirect', userClick }, (response) => {
                resolve(response?.redirectUrl || '');
            });
        });
    }
    function parseNationStatesInput(input, paramName, logContext) {
        const urlRegex = new RegExp(`https?:\\/\\/(?:www\\.)?nationstates\\.net\\/\\S*?${paramName}=([A-Za-z0-9_%+\\-]+)`, 'gi');
        let value = input;
        let match;
        while ((match = urlRegex.exec(input)) !== null) {
            value = match[1];
        }
        try {
            value = decodeURIComponent(value.replace(/\+/g, ' '));
        }
        catch (error) {
            console.warn(`Failed to decode ${logContext} input:`, error);
        }
        return canonicalize(value);
    }
    async function appendFormattedHappening(list, text, timestamp) {
        const li = document.createElement('li');
        li.innerHTML = `${formatReliantClickableTime(timestamp)}: ${formatApiString(text)}`;
        await decorateHappeningRegionLinks(li, text);
        list.appendChild(li);
    }
    async function renderFormattedHappenings(list, happeningsText, happeningsTimestamps) {
        list.innerHTML = '';
        for (let i = 0; i < happeningsText.length; i++) {
            await appendFormattedHappening(list, happeningsText[i], happeningsTimestamps[i]);
        }
    }
    function createInputButton(value, className) {
        const button = document.createElement('input');
        button.type = 'button';
        setReliantButtonLabel(button, value);
        if (className) {
            button.className = className;
        }
        return button;
    }
    function getPendingEndorseButton(nationName) {
        const nationKey = canonicalize(nationName);
        const endorseButtons = Array.from(nationsToEndorse.querySelectorAll('.endorse[data-endorsenation]'));
        return endorseButtons.find((button) => canonicalize(button.dataset.endorsenation || '') === nationKey) || null;
    }
    function removePendingEndorseNation(nationName) {
        const endorseButton = getPendingEndorseButton(nationName);
        if (!endorseButton) {
            return;
        }
        removeReliantButtonKeyHint(endorseButton);
        const listItem = endorseButton.closest('li');
        if (listItem) {
            listItem.remove();
        }
        else {
            endorseButton.remove();
        }
        refreshMainPageKeyDisplays();
    }
    async function endorseNextPendingJpNation() {
        const endorseButton = document.querySelector('.endorse[data-clicked="0"][data-endorsenation]');
        const nationName = endorseButton?.dataset.endorsenation;
        if (!endorseButton || !nationName) {
            return false;
        }
        if (await endorseNation(nationName, endorseButton) !== 'retry') {
            removePendingEndorseNation(nationName);
        }
        return true;
    }
    async function addPendingEndorseNation(nationName, prepend = false) {
        if (getPendingEndorseButton(nationName)) {
            return;
        }
        async function onEndorseClick(e) {
            const endorseButton = e.target;
            if (await endorseNation(nationName, endorseButton) !== 'retry') {
                removePendingEndorseNation(nationName);
            }
        }
        const endorseButton = createInputButton(`Endorse ${pretty(nationName)}`, 'ajaxbutton endorse');
        endorseButton.setAttribute('data-clicked', '0');
        endorseButton.setAttribute('data-endorsenation', nationName);
        endorseButton.setAttribute('data-updatedlocalid', '1');
        endorseButton.addEventListener('click', onEndorseClick);
        const endorseLi = document.createElement('li');
        endorseLi.appendChild(endorseButton);
        if (prepend) {
            nationsToEndorse.prepend(endorseLi);
        }
        else {
            nationsToEndorse.appendChild(endorseLi);
        }
        refreshMainPageKeyDisplays();
    }
    function nationMatchesEndorseKeywords(nationName, endorseKeywords) {
        return endorseKeywords.length === 0 ||
            endorseKeywords.some((keyword) => nationName.indexOf(keyword) !== -1);
    }
    async function shouldAddPendingEndorseNation(nationName) {
        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['currentwa', 'endorsekeywords'], resolve);
        });
        const endorseKeywords = result.endorsekeywords || [];
        return canonicalize(nationName) !== canonicalize(result.currentwa || '') &&
            nationsEndorsed.indexOf(nationName) === -1 &&
            nationMatchesEndorseKeywords(nationName, endorseKeywords);
    }
    async function updateEndorsePanelFromJpEvent(patternKey, match) {
        if (patternKey === 'ADMISSION') {
            const nationName = match[1];
            if (await shouldAddPendingEndorseNation(nationName)) {
                await addPendingEndorseNation(nationName, true);
            }
            return;
        }
        if (patternKey === 'RESIGN_WA') {
            removePendingEndorseNation(match[1]);
            return;
        }
        if (patternKey === 'ENDORSEMENT') {
            const currentWA = await getStorageValue('currentwa');
            if (currentWA && canonicalize(match[1]) === canonicalize(currentWA)) {
                nationsEndorsed.push(match[2]);
                removePendingEndorseNation(match[2]);
            }
        }
    }
    function copyTextToClipboard(value) {
        const copyText = document.createElement('textarea');
        copyText.value = value;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand('copy');
        document.body.removeChild(copyText);
    }
    async function clearMetricsAndRenderUpdatePredictorWheel(statusText, cache, cycleType, orderText = 'N/A') {
        updatePredictorOrderElement.innerHTML = orderText;
        updatePredictorRegionsLeftElement.innerHTML = 'N/A';
        updatePredictorEtaElement.innerHTML = 'N/A';
        updatePredictorStatusElement.innerHTML = statusText;
        await renderUpdatePredictorEarlierWheel(cache, undefined, cycleType);
    }
    async function manualLocalIdUpdate() {
        freshlyAdmitted = false;
        console.log('manually updating localid');
        let response = await makeAjaxQuery('/page=upload_flag', 'GET');
        getLocalId(response);
        status.innerHTML = 'Updated localid.';
        // reset buttons
        setReliantButtonLabel(document.querySelector('#move-to-jp'), 'Move to JP');
        setReliantButtonLabel(document.querySelector('#chasing-button'), 'Refresh');
        refreshMainPageKeyDisplays();
    }
    async function refreshLoggedInNationAndRegion() {
        let response = await makeAjaxQuery('/page=un', 'GET');
        if (!response) {
            status.innerHTML = 'Could not refresh logged-in nation.';
            return false;
        }
        const parsedDoc = new DOMParser().parseFromString(response, 'text/html');
        if (parsedDoc.querySelector('body#loggedout')) {
            await setStorageValue('currentwa', '');
            setCurrentRegion('N/A');
            status.innerHTML = 'Logged out; cleared stored nation and region.';
            return false;
        }
        getChk(response);
        const nationElement = parsedDoc.querySelector('#loggedin, [data-nname]');
        const regionElement = parsedDoc.querySelector('#panelregionbar > a');
        const nationName = nationElement?.getAttribute('data-nname');
        const regionHref = regionElement?.getAttribute('href') || regionElement?.href || '';
        const regionNameMatch = regionHref.match(/(?:^|\/)region=([A-Za-z0-9_-]+)/i);
        if (!nationName || !regionNameMatch) {
            status.innerHTML = 'Could not find logged-in nation or current region.';
            return false;
        }
        await setStorageValue('currentwa', nationName);
        setCurrentRegion(regionNameMatch[1]);
        status.innerHTML = `Checked logged-in nation ${nationName} in ${regionNameMatch[1]}.`;
        return true;
    }
    async function playMoveSuccessSound() {
        try {
            // Debounce logic: only play if enough time has passed since last play
            const currentTime = Date.now();
            const debounceDelay = 2000; // 2 seconds
            if (currentTime - lastMoveSoundTime < debounceDelay) {
                return; // Skip playing sound if within debounce window
            }
            const soundEnabled = await getStorageValue('moveSoundEnabled');
            if (soundEnabled !== false) { // Default to true if not set
                const volumePercentage = await getStorageValue('moveSoundVolume') || 50;
                // Check for custom sound first
                const customSound = await getStorageValue('customMoveSound');
                let audioSrc;
                if (customSound) {
                    audioSrc = customSound; // Use custom sound data URL
                }
                else {
                    audioSrc = chrome.runtime.getURL('audio/move-success.wav'); // Use default sound
                }
                const audio = new Audio(audioSrc);
                audio.volume = volumePercentage / 100; // Convert percentage to 0-1 range
                await audio.play();
                // Update the last play time after successfully playing
                lastMoveSoundTime = currentTime;
            }
        }
        catch (error) {
            console.log('Failed to play move success sound:', error);
        }
    }
    function renderTrackedDossierNations() {
        trackedDossierNations.innerHTML = '';
        if (nationsTracked.length === 0) {
            trackedDossierNations.innerHTML = '<li>None</li>';
            return;
        }
        nationsTracked.forEach((nation) => {
            const row = document.createElement('li');
            const nationLink = document.createElement('a');
            nationLink.href = `/nation=${nation}`;
            nationLink.innerHTML = nation;
            nationLink.target = '_blank';
            const removeButton = document.createElement('input');
            removeButton.type = 'button';
            removeButton.value = 'Remove';
            removeButton.style.marginLeft = '6px';
            removeButton.addEventListener('click', async () => {
                nationsTracked = nationsTracked.filter((trackedNation) => trackedNation !== nation);
                await setStorageValue('trackednations', nationsTracked);
                status.innerHTML = `Removed ${nation} from dossier tracking.`;
                renderTrackedDossierNations();
            });
            row.appendChild(nationLink);
            row.appendChild(removeButton);
            trackedDossierNations.appendChild(row);
        });
    }
    function getUpdatePredictorCycle(timestampSeconds = Math.floor(Date.now() / 1000)) {
        const latestMinorStart = UPDATE_PREDICTOR_MINOR_ANCHOR +
            Math.floor((timestampSeconds - UPDATE_PREDICTOR_MINOR_ANCHOR) / UPDATE_PREDICTOR_CYCLE_SECONDS) *
                UPDATE_PREDICTOR_CYCLE_SECONDS;
        const latestMajorStart = UPDATE_PREDICTOR_MAJOR_ANCHOR +
            Math.floor((timestampSeconds - UPDATE_PREDICTOR_MAJOR_ANCHOR) / UPDATE_PREDICTOR_CYCLE_SECONDS) *
                UPDATE_PREDICTOR_CYCLE_SECONDS;
        if (latestMajorStart > latestMinorStart) {
            return {
                type: 'major',
                start: latestMajorStart,
                nextSameType: latestMajorStart + UPDATE_PREDICTOR_CYCLE_SECONDS
            };
        }
        return {
            type: 'minor',
            start: latestMinorStart,
            nextSameType: latestMinorStart + UPDATE_PREDICTOR_CYCLE_SECONDS
        };
    }
    function getUpdatePredictorNextCycle(timestampSeconds = Math.floor(Date.now() / 1000)) {
        const nextMinorStart = UPDATE_PREDICTOR_MINOR_ANCHOR +
            (Math.floor((timestampSeconds - UPDATE_PREDICTOR_MINOR_ANCHOR) / UPDATE_PREDICTOR_CYCLE_SECONDS) + 1) *
                UPDATE_PREDICTOR_CYCLE_SECONDS;
        const nextMajorStart = UPDATE_PREDICTOR_MAJOR_ANCHOR +
            (Math.floor((timestampSeconds - UPDATE_PREDICTOR_MAJOR_ANCHOR) / UPDATE_PREDICTOR_CYCLE_SECONDS) + 1) *
                UPDATE_PREDICTOR_CYCLE_SECONDS;
        if (nextMajorStart < nextMinorStart) {
            return {
                type: 'major',
                start: nextMajorStart,
                nextSameType: nextMajorStart + UPDATE_PREDICTOR_CYCLE_SECONDS
            };
        }
        return {
            type: 'minor',
            start: nextMinorStart,
            nextSameType: nextMinorStart + UPDATE_PREDICTOR_CYCLE_SECONDS
        };
    }
    function getUpdatePredictorDisplayCycle(timestampSeconds = Math.floor(Date.now() / 1000)) {
        const latestCycle = getUpdatePredictorCycle(timestampSeconds);
        const secondsSinceStart = timestampSeconds - latestCycle.start;
        const hasLiveEventThisCycle = updatePredictorLiveCursorTime >= latestCycle.start;
        const stillWaitingForInitialSSE = Date.now() - updatePredictorLiveStateStartedAt < UPDATE_PREDICTOR_SSE_GRACE_MS;
        const cycleCouldStillBeActive = secondsSinceStart <= UPDATE_PREDICTOR_MAX_ACTIVE_SECONDS;
        if (hasLiveEventThisCycle || (cycleCouldStillBeActive && stillWaitingForInitialSSE)) {
            return {
                ...latestCycle,
                state: 'active'
            };
        }
        return {
            ...getUpdatePredictorNextCycle(timestampSeconds),
            state: 'next'
        };
    }
    function getUpdatePredictorRegion(cache, regionKey) {
        return cache.regions.find((region) => region.key === regionKey);
    }
    function formatUpdatePredictorPosition(region, cache) {
        if (!region)
            return 'N/A';
        return `${region.name} (${region.order + 1} / ${cache.regions.length})`;
    }
    function formatUpdatePredictorDate(timestampSeconds) {
        if (!timestampSeconds)
            return 'N/A';
        const date = new Date(timestampSeconds * 1000);
        return date.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    function getUpdatePredictorRegionCycleOffset(region, cycleType) {
        const timestamp = cycleType === 'major' ? region.lastMajorUpdate : region.lastMinorUpdate;
        if (!timestamp)
            return -1;
        return timestamp - getUpdatePredictorCycle(timestamp).start;
    }
    async function shouldSuppressChaseDestination(destinationRegionName) {
        const destinationRegionKey = canonicalize(destinationRegionName || '');
        if (!destinationRegionKey)
            return false;
        const displayCycle = getUpdatePredictorDisplayCycle();
        if (displayCycle.state !== 'active')
            return true;
        if (updatePredictorLiveRegions.has(destinationRegionKey)) {
            return true;
        }
        const cache = await loadUpdatePredictorCache();
        if (!cache)
            return false;
        const destinationRegion = getUpdatePredictorRegion(cache, destinationRegionKey);
        const cursorRegion = updatePredictorLiveCursorKey ?
            getUpdatePredictorRegion(cache, updatePredictorLiveCursorKey) :
            undefined;
        if (!destinationRegion || !cursorRegion)
            return false;
        if (destinationRegion.order <= cursorRegion.order) {
            return true;
        }
        const destinationDumpUpdateTime = displayCycle.type === 'major' ?
            destinationRegion.lastMajorUpdate :
            destinationRegion.lastMinorUpdate;
        const cursorDumpUpdateTime = displayCycle.type === 'major' ?
            cursorRegion.lastMajorUpdate :
            cursorRegion.lastMinorUpdate;
        if (!destinationDumpUpdateTime || !cursorDumpUpdateTime)
            return false;
        return destinationDumpUpdateTime - cursorDumpUpdateTime > CHASE_DESTINATION_MAX_DUMP_UPDATE_GAP_SECONDS;
    }
    function getUpdatePredictorComparableRegion(cache, cycleType, elapsedSeconds) {
        let output;
        let outputOffset = -1;
        for (const region of cache.regions) {
            const offset = getUpdatePredictorRegionCycleOffset(region, cycleType);
            if (offset >= 0 && offset <= elapsedSeconds && offset >= outputOffset) {
                output = region;
                outputOffset = offset;
            }
        }
        return output;
    }
    function renderUpdatePredictorTriggerCountdown() {
        if (updatePredictorTriggerCountdownEndsAt <= 0) {
            moveToUpdatePredictorRegionButton.classList.remove('button-destructive');
            updatePredictorTriggerCountdownElement.classList.add('hidden');
            updatePredictorTriggerCountdownElement.innerHTML = '';
            return;
        }
        const remainingSeconds = Math.max(0, Math.ceil((updatePredictorTriggerCountdownEndsAt - Date.now()) / 1000));
        if (remainingSeconds <= 0) {
            updatePredictorTriggerCountdownEndsAt = 0;
            moveToUpdatePredictorRegionButton.classList.remove('button-destructive');
            updatePredictorTriggerCountdownElement.classList.add('hidden');
            updatePredictorTriggerCountdownElement.innerHTML = '';
            if (updatePredictorTriggerCountdownTimer !== null) {
                clearInterval(updatePredictorTriggerCountdownTimer);
                updatePredictorTriggerCountdownTimer = null;
            }
            setUpdatePredictorMoveKeyActive(false);
            return;
        }
        moveToUpdatePredictorRegionButton.classList.add('button-destructive');
        updatePredictorTriggerCountdownElement.classList.remove('hidden');
        updatePredictorTriggerCountdownElement.innerHTML = `${remainingSeconds}s`;
    }
    function activateUpdatePredictorTriggerCountdown(seconds, startTimestampSeconds = Math.floor(Date.now() / 1000)) {
        updatePredictorTriggerCountdownEndsAt = (startTimestampSeconds + seconds) * 1000;
        setUpdatePredictorMoveKeyActive(true);
        if (updatePredictorTriggerCountdownTimer === null) {
            updatePredictorTriggerCountdownTimer = window.setInterval(() => {
                renderUpdatePredictorTriggerCountdown();
            }, 1000);
        }
        renderUpdatePredictorTriggerCountdown();
    }
    function parseUpdatePredictorDump(xmlText, fetchedAt) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('Could not parse regions.xml.');
        }
        const regions = Array.from(xmlDoc.querySelectorAll('REGION')).map((regionElement, order) => {
            const name = regionElement.querySelector('NAME')?.textContent || '';
            return {
                name,
                key: canonicalize(name),
                numnations: Number(regionElement.querySelector('NUMNATIONS')?.textContent) || 0,
                lastMajorUpdate: Number(regionElement.querySelector('LASTMAJORUPDATE')?.textContent) || 0,
                lastMinorUpdate: Number(regionElement.querySelector('LASTMINORUPDATE')?.textContent) || 0,
                order
            };
        }).filter((region) => region.key);
        return {
            fetchedAt,
            apiVersion: xmlDoc.querySelector('REGIONS')?.getAttribute('api_version') || '',
            regions
        };
    }
    async function loadUpdatePredictorCache() {
        if (updatePredictorDumpCache)
            return updatePredictorDumpCache;
        const sharedCache = await loadSharedRegionsDumpCache();
        return sharedCache ? await parseAndStoreUpdatePredictorDump(sharedCache.xmlText, sharedCache.fetchedAt) : null;
    }
    async function loadSharedRegionsDumpCache() {
        const cache = await getStorageValue(SHARED_REGIONS_DUMP_CACHE_KEY) || null;
        return cache && typeof cache.xmlText === 'string' ? cache : null;
    }
    function getRegionsDumpApiVersion(xmlText) {
        const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');
        return xmlDoc.querySelector('REGIONS')?.getAttribute('api_version') || '';
    }
    async function parseAndStoreUpdatePredictorDump(xmlText, fetchedAt) {
        updatePredictorDumpCache = parseUpdatePredictorDump(xmlText, fetchedAt);
        return updatePredictorDumpCache;
    }
    async function removeLegacyUpdatePredictorCache() {
        await new Promise((resolve) => chrome.storage.local.remove('updatePredictorDumpCacheV1', resolve));
    }
    async function refreshUpdatePredictorDump(force = false) {
        const sharedCache = await loadSharedRegionsDumpCache();
        if (!force && sharedCache && Date.now() - sharedCache.fetchedAt < UPDATE_PREDICTOR_STALE_CACHE_MS) {
            return await parseAndStoreUpdatePredictorDump(sharedCache.xmlText, sharedCache.fetchedAt);
        }
        const cached = await loadUpdatePredictorCache();
        if (!force && cached && Date.now() - cached.fetchedAt < UPDATE_PREDICTOR_STALE_CACHE_MS) {
            return cached;
        }
        if (typeof DecompressionStream === 'undefined') {
            updatePredictorStatusElement.innerHTML = 'Cannot read regions.xml.gz: this browser does not support gzip decompression.';
            return sharedCache ? await parseAndStoreUpdatePredictorDump(sharedCache.xmlText, sharedCache.fetchedAt) : cached;
        }
        updatePredictorStatusElement.innerHTML = 'Downloading regions.xml...';
        const response = await fetch('https://www.nationstates.net/pages/regions.xml.gz');
        if (!response.ok || !response.body) {
            throw new Error(`Could not download regions.xml.gz (${response.status}).`);
        }
        const decompressedStream = response.body.pipeThrough(new DecompressionStream('gzip'));
        const xmlText = await new Response(decompressedStream).text();
        const fetchedAt = Date.now();
        await setStorageValue(SHARED_REGIONS_DUMP_CACHE_KEY, {
            fetchedAt,
            apiVersion: getRegionsDumpApiVersion(xmlText),
            xmlText
        });
        return await parseAndStoreUpdatePredictorDump(xmlText, fetchedAt);
    }
    const PACIFIC_CYCLE_FORMATTER = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false
    });
    function getPacificDumpCycleKey(timestampMs) {
        const parts = PACIFIC_CYCLE_FORMATTER.formatToParts(new Date(timestampMs));
        const year = Number(parts.find((part) => part.type === 'year')?.value || 0);
        const month = Number(parts.find((part) => part.type === 'month')?.value || 0);
        const day = Number(parts.find((part) => part.type === 'day')?.value || 0);
        const hour = Number(parts.find((part) => part.type === 'hour')?.value || 0);
        const pacificMidnightUtc = Date.UTC(year, month - 1, day);
        return hour >= 23 ? pacificMidnightUtc : pacificMidnightUtc - 24 * 60 * 60 * 1000;
    }
    function isUpdatePredictorDumpOutdated(cache, nowMs = Date.now()) {
        if (!cache)
            return true;
        return getPacificDumpCycleKey(cache.fetchedAt) < getPacificDumpCycleKey(nowMs);
    }
    function syncUpdatePredictorDumpRefreshVisibility(cache) {
        const refreshButton = document.querySelector('#refresh-update-predictor-dump');
        if (!refreshButton)
            return;
        refreshButton.style.display = isUpdatePredictorDumpOutdated(cache) ? '' : 'none';
    }
    function getUpdatePredictorEarlierCandidates(cache, targetRegion, cycleType) {
        const targetOffset = getUpdatePredictorRegionCycleOffset(targetRegion, cycleType);
        if (targetOffset < 0)
            return [];
        return cache.regions
            .map((region) => {
            const offset = getUpdatePredictorRegionCycleOffset(region, cycleType);
            return {
                region,
                deltaSeconds: targetOffset - offset
            };
        })
            .filter(({ region, deltaSeconds }) => region.key !== targetRegion.key && deltaSeconds > 0)
            .sort((a, b) => a.deltaSeconds - b.deltaSeconds);
    }
    function updateUpdatePredictorEarlierCenteredItem() {
        if (!updatePredictorEarlierCandidateRows.length) {
            updatePredictorEarlierCenteredIndex = -1;
            return;
        }
        const wheelRect = updatePredictorEarlierWheelElement.getBoundingClientRect();
        const centerY = wheelRect.top + (wheelRect.height / 2);
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (let i = 0; i < updatePredictorEarlierCandidateRows.length; i++) {
            const rowRect = updatePredictorEarlierCandidateRows[i].getBoundingClientRect();
            const rowCenterY = rowRect.top + (rowRect.height / 2);
            const distance = Math.abs(rowCenterY - centerY);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        }
        updatePredictorEarlierCenteredIndex = closestIndex;
        for (let i = 0; i < updatePredictorEarlierCandidateRows.length; i++) {
            updatePredictorEarlierCandidateRows[i].classList.toggle('is-centered', i === closestIndex);
        }
    }
    function updateUpdatePredictorWheelEdgePadding() {
        const firstRow = updatePredictorEarlierCandidateRows[0];
        if (!firstRow) {
            updatePredictorEarlierWheelElement.style.removeProperty('--update-predictor-wheel-edge-padding');
            return;
        }
        const wheelHeight = parseFloat(window.getComputedStyle(updatePredictorEarlierWheelElement).height) ||
            updatePredictorEarlierWheelElement.clientHeight;
        const rowHeight = firstRow.getBoundingClientRect().height;
        const edgePadding = Math.max(0, Math.floor((wheelHeight - rowHeight) / 2));
        updatePredictorEarlierWheelElement.style.setProperty('--update-predictor-wheel-edge-padding', `${edgePadding}px`);
    }
    async function applyUpdatePredictorCandidate(index) {
        const selectedRow = updatePredictorEarlierCandidateRows[index];
        if (!selectedRow)
            return;
        const deltaSeconds = Number(selectedRow.getAttribute('data-delta-seconds'));
        if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0)
            return;
        updatePredictorTriggerSecondsInput.value = String(deltaSeconds);
        await setUpdatePredictorTriggerSeconds();
    }
    function centerUpdatePredictorEarlierRow(row, behavior = 'auto') {
        const top = row.offsetTop - ((updatePredictorEarlierWheelElement.clientHeight - row.offsetHeight) / 2);
        updatePredictorEarlierWheelElement.scrollTo({ top: Math.max(0, top), behavior });
    }
    function getUpdatePredictorTriggerCandidateIndex() {
        if (!updatePredictorEarlierCandidateRows.length)
            return -1;
        const triggerSeconds = Number(updatePredictorTriggerSecondsInput.value) || updatePredictorAlertSecondsThreshold;
        let triggerCandidateIndex = 0;
        for (let i = 0; i < updatePredictorEarlierCandidateRows.length; i++) {
            const deltaSeconds = Number(updatePredictorEarlierCandidateRows[i].getAttribute('data-delta-seconds'));
            if (!Number.isFinite(deltaSeconds))
                continue;
            if (deltaSeconds > triggerSeconds) {
                return i === 0 ? 0 : triggerCandidateIndex;
            }
            triggerCandidateIndex = i;
        }
        return triggerCandidateIndex;
    }
    function centerUpdatePredictorEarlierTriggerCandidate(behavior = 'auto') {
        const triggerCandidate = updatePredictorEarlierCandidateRows[getUpdatePredictorTriggerCandidateIndex()];
        if (!triggerCandidate)
            return;
        centerUpdatePredictorEarlierRow(triggerCandidate, behavior);
        updateUpdatePredictorEarlierCenteredItem();
    }
    async function renderUpdatePredictorEarlierWheel(cache, targetRegion, cycleType) {
        if (!cache || !targetRegion) {
            if (updatePredictorEarlierPreviewTimeout !== null) {
                clearTimeout(updatePredictorEarlierPreviewTimeout);
                updatePredictorEarlierPreviewTimeout = null;
            }
            updatePredictorEarlierSignature = '';
            updatePredictorEarlierCandidateRows = [];
            updatePredictorEarlierCenteredIndex = -1;
            updatePredictorEarlierItemsElement.innerHTML = '';
            updatePredictorEarlierEmptyElement.innerHTML = cache ?
                'Target region not found in dump.' :
                'Download regions dump to populate candidates.';
            updatePredictorEarlierEmptyElement.classList.remove('hidden');
            return;
        }
        const allCandidates = getUpdatePredictorEarlierCandidates(cache, targetRegion, cycleType);
        const candidates = [];
        const seenDeltas = new Set();
        for (const candidate of allCandidates) {
            const isNearby = candidate.deltaSeconds <= UPDATE_PREDICTOR_EARLIER_MAX_NEARBY_SECONDS;
            const hasEnoughRows = seenDeltas.size >= UPDATE_PREDICTOR_EARLIER_MIN_ROWS;
            if (!isNearby && hasEnoughRows) {
                break;
            }
            candidates.push(candidate);
            seenDeltas.add(candidate.deltaSeconds);
        }
        const signature = `${targetRegion.key}:${cycleType}:${candidates.map((candidate) => `${candidate.region.key}:${candidate.deltaSeconds}`).join('|')}`;
        if (signature === updatePredictorEarlierSignature) {
            updateUpdatePredictorEarlierCenteredItem();
            return;
        }
        if (updatePredictorEarlierPreviewTimeout !== null) {
            clearTimeout(updatePredictorEarlierPreviewTimeout);
            updatePredictorEarlierPreviewTimeout = null;
        }
        updatePredictorEarlierSignature = signature;
        updatePredictorEarlierCandidateRows = [];
        updatePredictorEarlierCenteredIndex = -1;
        updatePredictorEarlierItemsElement.innerHTML = '';
        if (!candidates.length) {
            updatePredictorEarlierEmptyElement.innerHTML = 'No earlier-updating candidates available.';
            updatePredictorEarlierEmptyElement.classList.remove('hidden');
            return;
        }
        const groupedCandidates = [];
        const candidateGroups = new Map();
        for (const candidate of candidates) {
            const group = candidateGroups.get(candidate.deltaSeconds) || [];
            group.push(candidate);
            candidateGroups.set(candidate.deltaSeconds, group);
        }
        const sortedDeltas = Array.from(candidateGroups.keys()).sort((a, b) => a - b);
        for (const delta of sortedDeltas) {
            const group = candidateGroups.get(delta) || [];
            if (!group.length)
                continue;
            const representative = [...group].sort((a, b) => (b.region.numnations - a.region.numnations) || a.region.name.localeCompare(b.region.name))[0];
            const extraCount = Math.max(0, group.length - 1);
            const label = extraCount > 0 ?
                `${representative.region.name} and ${extraCount} more regions` :
                representative.region.name;
            groupedCandidates.push({
                region: { ...representative.region, name: label },
                deltaSeconds: delta
            });
        }
        const renderCandidateRows = (rowsToRender) => {
            updatePredictorEarlierCandidateRows = [];
            updatePredictorEarlierCenteredIndex = -1;
            updatePredictorEarlierItemsElement.innerHTML = '';
            updatePredictorEarlierEmptyElement.classList.add('hidden');
            const fragment = document.createDocumentFragment();
            for (const candidate of rowsToRender) {
                const row = document.createElement('button');
                row.type = 'button';
                row.className = 'update-predictor-earlier-row';
                row.setAttribute('data-delta-seconds', String(candidate.deltaSeconds));
                row.innerHTML = `<span>${candidate.region.name}</span><span>${candidate.deltaSeconds}s earlier</span>`;
                row.addEventListener('click', async () => {
                    centerUpdatePredictorEarlierRow(row, 'smooth');
                    await applyUpdatePredictorCandidate(updatePredictorEarlierCandidateRows.indexOf(row));
                });
                fragment.appendChild(row);
                updatePredictorEarlierCandidateRows.push(row);
            }
            updatePredictorEarlierItemsElement.appendChild(fragment);
            updateUpdatePredictorWheelEdgePadding();
            updateUpdatePredictorEarlierCenteredItem();
        };
        const mostNationsFirst = [...candidates].sort((a, b) => (b.region.numnations - a.region.numnations) || a.region.name.localeCompare(b.region.name))[0];
        const extraCount = Math.max(0, candidates.length - 1);
        renderCandidateRows([{
                region: { ...mostNationsFirst.region, name: `${mostNationsFirst.region.name} and ${extraCount} more regions` },
                deltaSeconds: mostNationsFirst.deltaSeconds
            }]);
        updatePredictorEarlierPreviewTimeout = window.setTimeout(() => {
            renderCandidateRows(groupedCandidates);
            centerUpdatePredictorEarlierTriggerCandidate();
            updatePredictorEarlierPreviewTimeout = null;
        }, UPDATE_PREDICTOR_EARLIER_PREVIEW_MS);
    }
    async function renderUpdatePredictor(cache = updatePredictorDumpCache) {
        syncUpdatePredictorDumpRefreshVisibility(cache);
        setReliantButtonLabel(moveToUpdatePredictorRegionButton, updatePredictorRegionKey ?
            `Move to ${pretty(updatePredictorRegionKey)}` :
            'Move to Region');
        refreshMainPageKeyDisplays();
        const displayCycle = getUpdatePredictorDisplayCycle();
        updatePredictorCycleElement.innerHTML = displayCycle.state === 'active' ?
            `Active ${displayCycle.type} update` :
            `Next ${displayCycle.type} update around ${formatUpdatePredictorDate(displayCycle.start)}`;
        if (!updatePredictorRegionKey) {
            await clearMetricsAndRenderUpdatePredictorWheel('Choose a region to track.', cache, displayCycle.type);
            return;
        }
        if (!cache) {
            await clearMetricsAndRenderUpdatePredictorWheel('Download the regions dump to estimate update order.', cache, displayCycle.type);
            return;
        }
        const targetRegion = getUpdatePredictorRegion(cache, updatePredictorRegionKey);
        const cacheAgeHours = (Date.now() - cache.fetchedAt) / 3600000;
        const staleStatus = cacheAgeHours > 24 ? ' Low confidence: dump cache is stale.' : '';
        if (!targetRegion) {
            await clearMetricsAndRenderUpdatePredictorWheel(`Watching ${pretty(updatePredictorRegionKey)} by SSE, but it is not in the cached dump.${staleStatus}`, cache, displayCycle.type, 'Not in dump');
            return;
        }
        const selectedLastUpdate = displayCycle.type === 'major' ?
            targetRegion.lastMajorUpdate :
            targetRegion.lastMinorUpdate;
        const isActiveCycle = displayCycle.state === 'active';
        const targetUpdatedThisCycle = isActiveCycle && updatePredictorLiveRegions.has(targetRegion.key);
        const cursorRegion = updatePredictorLiveCursorKey ?
            getUpdatePredictorRegion(cache, updatePredictorLiveCursorKey) :
            undefined;
        const cursorLastUpdate = cursorRegion ? (displayCycle.type === 'major' ? cursorRegion.lastMajorUpdate : cursorRegion.lastMinorUpdate) : 0;
        const targetLikelyAlreadyUpdated = (isActiveCycle &&
            !targetUpdatedThisCycle &&
            cursorRegion &&
            selectedLastUpdate > 0 &&
            cursorLastUpdate > selectedLastUpdate);
        const elapsedSeconds = Math.max(0, isActiveCycle ? (updatePredictorLiveCursorTime || Math.floor(Date.now() / 1000)) - displayCycle.start : 0);
        const comparableRegion = isActiveCycle ?
            getUpdatePredictorComparableRegion(cache, displayCycle.type, elapsedSeconds) :
            undefined;
        let regionsLeft;
        let statusText = `Tracking ${targetRegion.name}.`;
        if (targetUpdatedThisCycle) {
            regionsLeft = 0;
            updatePredictorCycleElement.innerHTML = `Active ${displayCycle.type} update: ${targetRegion.name} updated`;
            statusText += ` Updated this ${displayCycle.type} cycle.`;
        }
        else if (isActiveCycle && cursorRegion && updatePredictorLiveCursorTime > displayCycle.start) {
            regionsLeft = targetRegion.order > cursorRegion.order ?
                targetRegion.order - cursorRegion.order :
                cache.regions.length - cursorRegion.order + targetRegion.order;
            updatePredictorCycleElement.innerHTML =
                `Active ${displayCycle.type} update: ${formatUpdatePredictorPosition(cursorRegion, cache)}`;
            statusText += ` Live cursor from ${cursorRegion.name} at ${formatUpdatePredictorDate(updatePredictorLiveCursorTime)}.`;
        }
        else if (isActiveCycle) {
            regionsLeft = targetRegion.order;
            updatePredictorCycleElement.innerHTML = `Active ${displayCycle.type} update: waiting for live cursor`;
            statusText += ' Waiting for live update-region SSE events.';
        }
        else {
            regionsLeft = targetRegion.order;
            statusText += ` No active update detected. Next ${displayCycle.type} update starts around ${formatUpdatePredictorDate(displayCycle.start)}.`;
        }
        const targetLastUpdateDeltaSeconds = Math.abs(selectedLastUpdate - cursorLastUpdate);
        if (isActiveCycle &&
            cursorRegion &&
            selectedLastUpdate > 0 &&
            cursorLastUpdate > 0 &&
            targetLastUpdateDeltaSeconds <= updatePredictorAlertSecondsThreshold &&
            updatePredictorTimeAlertKey !== `${displayCycle.start}:${targetRegion.key}`) {
            updatePredictorTimeAlertKey = `${displayCycle.start}:${targetRegion.key}`;
            activateUpdatePredictorTriggerCountdown(updatePredictorAlertSecondsThreshold, updatePredictorLiveCursorTime);
            void playMoveSuccessSound();
        }
        renderUpdatePredictorTriggerCountdown();
        updatePredictorOrderElement.innerHTML = formatUpdatePredictorPosition(targetRegion, cache);
        updatePredictorRegionsLeftElement.innerHTML = targetLikelyAlreadyUpdated ? 'Already updated' : String(regionsLeft);
        updatePredictorEtaElement.innerHTML = formatUpdatePredictorPosition(comparableRegion, cache);
        updatePredictorStatusElement.innerHTML = `${statusText} Last ${displayCycle.type} update: ${formatUpdatePredictorDate(selectedLastUpdate)}.${staleStatus}`;
        await renderUpdatePredictorEarlierWheel(cache, targetRegion, displayCycle.type);
    }
    async function initializeUpdatePredictor() {
        updatePredictorRegionInput.value = updatePredictorRegionKey;
        await removeLegacyUpdatePredictorCache();
        try {
            const cache = await refreshUpdatePredictorDump(false);
            await renderUpdatePredictor(cache);
        }
        catch (error) {
            console.error('Failed to initialize update predictor:', error);
            await loadUpdatePredictorCache();
            await renderUpdatePredictor();
            updatePredictorStatusElement.innerHTML = `Could not refresh dump. ${updatePredictorDumpCache ? 'Using cached data.' : 'No cached data available.'}`;
        }
    }
    function parseUpdatePredictorRegionInput(input) {
        return parseNationStatesInput(input, 'region', 'update predictor region');
    }
    async function setUpdatePredictorRegion() {
        updatePredictorRegionKey = parseUpdatePredictorRegionInput(updatePredictorRegionInput.value);
        await setStorageValue(UPDATE_PREDICTOR_REGION_KEY, updatePredictorRegionKey);
        await renderUpdatePredictor();
        reconnectSSE();
    }
    async function setUpdatePredictorTriggerSeconds() {
        const triggerSeconds = Number(updatePredictorTriggerSecondsInput.value);
        if (!Number.isFinite(triggerSeconds) || triggerSeconds <= 0) {
            updatePredictorStatusElement.innerHTML = 'Trigger seconds must be a positive number.';
            return;
        }
        updatePredictorAlertSecondsThreshold = triggerSeconds;
        await setStorageValue(UPDATE_PREDICTOR_ALERT_SECONDS_KEY, triggerSeconds);
        updatePredictorStatusElement.innerHTML = `Set update predictor trigger to ${triggerSeconds} second(s).`;
        centerUpdatePredictorEarlierTriggerCandidate('smooth');
    }
    async function manualRefreshUpdatePredictorDump() {
        try {
            const cache = await refreshUpdatePredictorDump(true);
            await renderUpdatePredictor(cache);
            if (cache)
                notyf.success('Updated regions dump.');
        }
        catch (error) {
            console.error('Failed to refresh regions dump:', error);
            updatePredictorStatusElement.innerHTML = 'Could not refresh regions dump. Check the console for details.';
        }
    }
    async function moveToUpdatePredictorRegion() {
        if (getReliantButtonLabel(moveToUpdatePredictorRegionButton) === 'Update Localid') {
            await manualLocalIdUpdate();
            setReliantButtonLabel(moveToUpdatePredictorRegionButton, 'Move to Region');
            refreshMainPageKeyDisplays();
            return;
        }
        if (!updatePredictorRegionKey) {
            status.innerHTML = 'Set an update predictor region first.';
            return;
        }
        const localId = await getStorageValue('localid');
        if (!localId) {
            status.innerHTML = 'No localid found. Update localid first.';
            return;
        }
        if (!(await moveNationToRegion(updatePredictorRegionKey))) {
            status.innerHTML = `Failed to move to ${updatePredictorRegionKey}.`;
            setReliantButtonLabel(moveToUpdatePredictorRegionButton, 'Update Localid');
            refreshMainPageKeyDisplays();
            return;
        }
        status.innerHTML = `Moved to ${updatePredictorRegionKey}`;
        resetRegionStatusDetails();
        setUpdatePredictorMoveKeyActive(false);
        setReliantButtonLabel(moveToUpdatePredictorRegionButton, 'Move to Region');
        refreshMainPageKeyDisplays();
    }
    function resetUpdatePredictorLiveState() {
        updatePredictorLiveCycleStart = getUpdatePredictorCycle().start;
        updatePredictorLiveRegions = new Set();
        updatePredictorLiveCursorKey = '';
        updatePredictorLiveCursorTime = 0;
        updatePredictorLiveStateStartedAt = Date.now();
        updatePredictorTimeAlertKey = '';
        updatePredictorTriggerCountdownEndsAt = 0;
        setUpdatePredictorMoveKeyActive(false);
        if (updatePredictorTriggerCountdownTimer !== null) {
            clearInterval(updatePredictorTriggerCountdownTimer);
            updatePredictorTriggerCountdownTimer = null;
        }
        renderUpdatePredictorTriggerCountdown();
    }
    function recordUpdatePredictorSSE(regionName, eventTime) {
        if (!updatePredictorRegionKey || !eventTime)
            return;
        const activeCycle = getUpdatePredictorCycle();
        if (eventTime < activeCycle.start)
            return;
        if (activeCycle.start !== updatePredictorLiveCycleStart) {
            updatePredictorLiveCycleStart = activeCycle.start;
            updatePredictorLiveRegions = new Set();
            updatePredictorLiveCursorKey = '';
            updatePredictorLiveCursorTime = 0;
            updatePredictorLiveStateStartedAt = Date.now();
        }
        const regionKey = canonicalize(regionName);
        updatePredictorLiveRegions.add(regionKey);
        const cache = updatePredictorDumpCache;
        const seenRegion = cache ? getUpdatePredictorRegion(cache, regionKey) : undefined;
        if (seenRegion && eventTime >= updatePredictorLiveCursorTime) {
            updatePredictorLiveCursorKey = regionKey;
            updatePredictorLiveCursorTime = eventTime;
        }
        void renderUpdatePredictor();
        void refreshChaseReportHighlights();
    }
    function reconnectSSE() {
        if (sseReconnectTimeout) {
            clearTimeout(sseReconnectTimeout);
        }
        sseReconnectTimeout = setTimeout(() => {
            buildSSEUrl().then((url) => {
                createSSEConnection(url);
                sseReconnectTimeout = null;
            });
        }, SSE_DEBOUNCE_DELAY);
    }
    /*
     * Event Handlers
     */
    async function resignWaAsync(needsAdmit = false) {
        const chk = await getStorageValue('chk');
        const currentWa = await getStorageValue('currentwa');
        let formData = new FormData();
        formData.set('action', 'leave_UN');
        formData.set('chk', chk);
        const response = await makeAjaxQuery('/page=UN_status', 'POST', formData);
        if (response.indexOf('You inform the World Assembly that') === -1) {
            status.innerHTML = `Failed to resign from the WA on ${currentWa}.`;
            return false;
        }
        freshlyAdmitted = false;
        status.innerHTML = `Resigned from the WA on ${currentWa}.`;
        await setStorageValue('currentwa', '');
        refreshMainPageKeyDisplays();
        nationsTracked = [];
        await setStorageValue('trackednations', []);
        currentWANation.classList.remove('highlight-active', 'highlight-update');
        resetChaseAssistState();
        chaseAssistStep = needsAdmit ? 'admit-next-switcher' : 'idle';
        await setStorageValue('occupationsequence', 'Resigned');
        await persistChaseAssistState('Resigned');
        return true;
    }
    function resignWA(e) {
        void resignWaAsync();
    }
    async function admitWaAsync() {
        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['switchers', 'prepswitchers'], resolve);
        });
        setReliantButtonLabel(document.querySelector('#chasing-button'), 'Refresh');
        setReliantButtonLabel(document.querySelector('#move-to-jp'), 'Move to JP');
        document.querySelector('#chasing-button').disabled = false;
        refreshMainPageKeyDisplays();
        setCurrentRegion('N/A');
        resetRegionStatusDetails();
        nationsToEndorse.innerHTML = '';
        nationsToDossier.innerHTML = '';
        nationsEndorsed = [];
        let storedSwitchers = orderSwitchersByPrepList(result.switchers ?? [], result.prepswitchers ?? []);
        if (!storedSwitchers.length) {
            status.innerHTML = 'No switchers stored.';
            const chasingButton = document.querySelector('#chasing-button');
            setReliantButtonLabel(chasingButton, 'No Switchers');
            chasingButton.disabled = true;
            return false;
        }
        let formData = new FormData();
        formData.set('nation', storedSwitchers[0].name);
        formData.set('appid', storedSwitchers[0].appid);
        let response = await makeAjaxQuery('/cgi-bin/join_un.cgi', 'POST', formData, true);
        if (response.indexOf('Welcome to the World Assembly, new member') !== -1) {
            const admittedSwitcherName = storedSwitchers[0].name;
            freshlyAdmitted = true;
            status.innerHTML = `Admitted to the WA on ${admittedSwitcherName}.`;
            await chrome.storage.local.set({ 'currentwa': admittedSwitcherName });
            refreshMainPageKeyDisplays();
            nationsTracked = [];
            await chrome.storage.local.set({ trackednations: [] });
            getChk(response);
            storedSwitchers.shift();
            await chrome.storage.local.set({ 'switchers': storedSwitchers });
            resetChaseAssistState('idle', 'Checking identity');
            await setStorageValue('occupationsequence', 'Checking identity');
            await persistChaseAssistState('Checking identity');
            status.innerHTML = `Admitted to the WA on ${admittedSwitcherName}.`;
            return true;
        }
        else if (response.indexOf('Another WA member nation is currently using the same email address') !== -1) {
            status.innerHTML = `Error admitting to the WA on ${storedSwitchers[0].name} (nation already in WA).`;
            await chrome.storage.local.set({ 'switchers': storedSwitchers });
            return false;
        }
        else {
            status.innerHTML = `Error admitting to the WA on ${storedSwitchers[0].name} (invalid application).`;
            storedSwitchers.shift();
            await chrome.storage.local.set({ 'switchers': storedSwitchers });
            return false;
        }
    }
    function admitWA(e) {
        void admitWaAsync();
    }
    async function refreshEndorseAsync(e) {
        const clickedButton = e?.target;
        const jpHappenings = document.querySelector('#jp-happenings');
        nationsToEndorse.innerHTML = '';
        jpHappenings.innerHTML = '';
        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['jumppoint', 'currentwa', 'endorsekeywords'], resolve);
        });
        let endorseKeywords = [];
        if (result.endorsekeywords)
            endorseKeywords = result.endorsekeywords;
        const jumpPoint = result.jumppoint || 'artificial_solar_system';
        const apiResponse = await fetchWithRateLimit(`/cgi-bin/api.cgi?q=happenings;view=region.${jumpPoint};filter=move+member+endo`, {}, clickedButton);
        const apiText = await apiResponse.text();
        const happeningsObject = parseApiHappenings(apiText);
        const happeningsText = happeningsObject.text;
        const happeningsTimeStamps = happeningsObject.timestamps;
        const nationNameRegex = new RegExp('@@([A-Za-z0-9_-]+)@@');
        await renderFormattedHappenings(jpHappenings, happeningsText, happeningsTimeStamps);
        let resigned = [];
        for (let i = 0; i != happeningsText.length; i++) {
            const nationNameMatch = nationNameRegex.exec(happeningsText[i]);
            if (!nationNameMatch) {
                continue;
            }
            const nationName = nationNameMatch[1];
            // don't allow us to endorse ourself
            if (canonicalize(nationName) === canonicalize(result.currentwa))
                resigned.push(nationName);
            // don't allow us to endorse the same nation more than once per switch
            if (nationsEndorsed.indexOf(nationName) !== -1)
                resigned.push(nationName);
            // Don't include nations that probably aren't in the WA
            if (happeningsText[i].indexOf('resigned from') !== -1)
                resigned.push(nationName);
            // Only include nations with keywords
            if (!nationMatchesEndorseKeywords(nationName, endorseKeywords)) {
                resigned.push(nationName);
            }
            else if (happeningsText[i].indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    await addPendingEndorseNation(nationName);
                }
            }
        }
    }
    function refreshEndorse(e) {
        void refreshEndorseAsync(e);
    }
    function parseEndorseNationInput(input) {
        return parseNationStatesInput(input, 'nation', 'endorse nation');
    }
    function setEndorseButtonNeedsLocalId(endorseButton) {
        if (!endorseButton) {
            return;
        }
        endorseButton.dataset.endorseLabelBeforeLocalid = getReliantButtonLabel(endorseButton);
        endorseButton.setAttribute('data-updatedlocalid', '0');
        setReliantButtonLabel(endorseButton, 'Update Localid');
        refreshMainPageKeyDisplays();
    }
    function restoreEndorseButtonAfterLocalId(endorseButton) {
        const endorseLabel = endorseButton.dataset.endorseLabelBeforeLocalid;
        if (endorseLabel) {
            setReliantButtonLabel(endorseButton, endorseLabel);
            delete endorseButton.dataset.endorseLabelBeforeLocalid;
        }
        endorseButton.setAttribute('data-updatedlocalid', '1');
        refreshMainPageKeyDisplays();
    }
    async function endorseNation(nationName, clickedButton) {
        if (clickedButton?.getAttribute('data-updatedlocalid') !== '0') {
            const endorseResult = await submitEndorsement(nationName);
            if (endorseResult === 'security-check-failed') {
                status.innerHTML = `Failed to endorse ${nationName}.`;
                setEndorseButtonNeedsLocalId(clickedButton);
                return 'retry';
            }
            else if (endorseResult === 'different-region') {
                status.innerHTML = `Failed to endorse ${nationName} (different region).`;
                clickedButton?.setAttribute('data-clicked', '1');
                return 'unavailable';
            }
            else if (endorseResult === 'non-wa-nation') {
                status.innerHTML = `Failed to endorse ${nationName} (endorsed nation not in WA).`;
                clickedButton?.setAttribute('data-clicked', '1');
                return 'unavailable';
            }
            else if (endorseResult === 'already-endorsed') {
                status.innerHTML = `Already endorsed ${nationName}.`;
                clickedButton?.setAttribute('data-clicked', '1');
                nationsEndorsed.push(nationName);
                return 'endorsed';
            }
            else if (endorseResult === 'error-page-redirect') {
                status.innerHTML = `Failed to endorse ${nationName} (NationStates error page).`;
                setEndorseButtonNeedsLocalId(clickedButton);
                return 'retry';
            }
            clickedButton?.setAttribute('data-clicked', '1');
            status.innerHTML = `Endorsed ${nationName}.`;
            nationsEndorsed.push(nationName);
            return 'endorsed';
        }
        await manualLocalIdUpdate();
        restoreEndorseButtonAfterLocalId(clickedButton);
        status.innerHTML = `Updated localid. Press endorse again for ${nationName}.`;
        return 'retry';
    }
    async function endorseFromInput(input, endorseButton) {
        const nationName = parseEndorseNationInput(input.value.trim());
        if (!nationName) {
            status.innerHTML = 'Enter a nation name to endorse.';
            return;
        }
        if (nationsEndorsed.indexOf(nationName) !== -1) {
            status.innerHTML = `${nationName} was already endorsed this switch.`;
            return;
        }
        endorseButton.disabled = true;
        const endorseResult = await endorseNation(nationName, endorseButton);
        endorseButton.disabled = false;
        if (endorseResult === 'endorsed') {
            input.value = '';
        }
    }
    async function manualEndorse(e) {
        await endorseFromInput(manualEndorseNationInput, e.target);
    }
    async function updatePredictorEndorse(e) {
        await endorseFromInput(updatePredictorEndorseNationInput, e.target);
    }
    let potentialNationsToTrack = new Set();
    async function refreshDossierAsync(e) {
        const clickedButton = e?.target;
        const raiderHappenings = document.querySelector('#raider-happenings');
        raiderHappenings.innerHTML = '';
        nationsToDossier.innerHTML = '';
        potentialNationsToTrack.clear();
        const result = await new Promise((resolve) => {
            chrome.storage.local.get(['dossierkeywords'], resolve);
        });
        let dossierKeywords = [];
        if (result.dossierkeywords)
            dossierKeywords = result.dossierkeywords;
        const raiderRegions = await getRaiderTrackingRegionKeys();
        const regionHappenings = [];
        const seenHappenings = new Set();
        if (raiderRegions.length > 0) {
            const regionView = raiderRegions.map((region) => encodeURIComponent(region)).join(',');
            const apiResponse = await fetchWithRateLimit(`/cgi-bin/api.cgi?q=happenings;view=region.${regionView};filter=move+member+endo`, {}, clickedButton);
            const apiText = await apiResponse.text();
            const happeningsResponse = parseApiHappenings(apiText);
            for (let i = 0; i != happeningsResponse.text.length; i++) {
                const happeningKey = `${happeningsResponse.timestamps[i]}:${happeningsResponse.text[i]}`;
                if (seenHappenings.has(happeningKey)) {
                    continue;
                }
                seenHappenings.add(happeningKey);
                regionHappenings.push({
                    text: happeningsResponse.text[i],
                    timestamp: happeningsResponse.timestamps[i],
                    region: getHappeningRegionFromText(happeningsResponse.text[i], raiderRegions)
                });
            }
        }
        regionHappenings.sort((left, right) => Number(right.timestamp) - Number(left.timestamp));
        const nationNameRegex = new RegExp('@@([A-Za-z0-9_-]+)@@');
        const endorsementRegex = new RegExp('@@[A-Za-z0-9_-]+@@ endorsed @@([A-Za-z0-9_-]+)@@');
        raiderHappenings.innerHTML = '';
        for (let i = 0; i < regionHappenings.length; i++) {
            const happening = regionHappenings[i];
            const formattedText = formatHappeningWithBucketRegion(formatApiString(happening.text), extractEventRegions(happening.text), happening.region);
            const li = document.createElement('li');
            li.innerHTML = `${formatReliantClickableTime(happening.timestamp)}: ${formattedText}`;
            await decorateHappeningRegionLinks(li, happening.text);
            raiderHappenings.appendChild(li);
        }
        let resigned = [];
        for (let i = 0; i != regionHappenings.length; i++) {
            const happening = regionHappenings[i];
            const nationNameMatch = nationNameRegex.exec(happening.text);
            if (!nationNameMatch) {
                continue;
            }
            const endorsementMatch = endorsementRegex.exec(happening.text);
            const nationName = endorsementMatch ? endorsementMatch[1] : nationNameMatch[1];
            // don't let us dossier the same nation twice
            if (nationsTracked.indexOf(nationName) !== -1)
                resigned.push(nationName);
            // Don't include nations that probably aren't in the WA
            if (happening.text.indexOf('resigned from') !== -1)
                resigned.push(nationName);
            if (dossierKeywords.length &&
                (dossierKeywords.every((keyword) => nationName.indexOf(keyword) === -1))) {
                resigned.push(nationName);
            }
            else if (happening.text.indexOf('was admitted') !== -1) {
                if (resigned.indexOf(nationName) === -1) {
                    await trackRaiderNation(nationName, happening.region, false);
                }
            }
            else if (endorsementMatch) {
                if (resigned.indexOf(nationName) === -1) {
                    await trackRaiderNation(nationName, happening.region, false);
                }
            }
        }
        // Add "Track All" button if there are multiple nations to track
        if (potentialNationsToTrack.size > 3) {
            const trackAllLi = document.createElement('li');
            trackAllLi.style.borderTop = '1px solid #333';
            trackAllLi.style.paddingTop = '5px';
            trackAllLi.style.marginTop = '5px';
            let trackAllButton = createInputButton(`Track All ${potentialNationsToTrack.size} Nations`, 'ajaxbutton');
            trackAllButton.style.fontWeight = 'bold';
            trackAllButton.addEventListener('click', async () => {
                // Filter out nations that are already tracked
                const nationsToAdd = Array.from(potentialNationsToTrack)
                    .filter(nation => !nationsTracked.includes(nation));
                if (nationsToAdd.length > 0) {
                    // Add all nations at once
                    nationsTracked.push(...nationsToAdd);
                    await setStorageValue('trackednations', nationsTracked);
                    // Clear the list
                    nationsToDossier.innerHTML = '';
                    potentialNationsToTrack.clear();
                    // Show feedback
                    status.innerHTML = `Tracking ${nationsToAdd.length} nations. Live updates will start in ${SSE_DEBOUNCE_DELAY / 1000} seconds.`;
                    notyf.success(`Added ${nationsToAdd.length} nations to tracking`);
                }
                else {
                    status.innerHTML = 'All nations already being tracked.';
                }
            });
            trackAllLi.appendChild(trackAllButton);
            // Add at the beginning of the list
            nationsToDossier.insertBefore(trackAllLi, nationsToDossier.firstChild);
        }
    }
    function refreshDossier(e) {
        void refreshDossierAsync(e);
    }
    function setRaiderJP(e) {
        const newRaiderJP = canonicalize(document.querySelector('#raider-jp').value);
        chrome.storage.local.set({ 'raiderjp': newRaiderJP });
        notyf.success(`Set raider JP to ${newRaiderJP}`);
        document.querySelector('#raider-jp').value = newRaiderJP;
    }
    async function addManualDossierNation(e) {
        const nationInput = document.querySelector('#manual-dossier-nation');
        const manualNation = canonicalize(nationInput.value.trim());
        if (!manualNation) {
            status.innerHTML = 'Enter a nation name to add.';
            return;
        }
        if (nationsTracked.indexOf(manualNation) !== -1) {
            status.innerHTML = `${manualNation} is already tracked.`;
            return;
        }
        nationsTracked.push(manualNation);
        await setStorageValue('trackednations', nationsTracked);
        nationInput.value = '';
        status.innerHTML = `Tracking ${manualNation}.`;
        renderTrackedDossierNations();
    }
    function moveToJP(e) {
        const button = e.target;
        if (getReliantButtonLabel(button) == 'Move to JP') {
            chrome.storage.local.get('jumppoint', async (jumppointresult) => {
                const moveRegion = jumppointresult.jumppoint;
                if (await moveNationToRegion(moveRegion))
                    status.innerHTML = `Moved to ${moveRegion}`;
                else
                    status.innerHTML = `Failed to move to ${moveRegion}.`;
                setReliantButtonLabel(button, 'Update Localid');
                refreshMainPageKeyDisplays();
            });
        }
        else if (getReliantButtonLabel(button) == 'Update Localid') {
            manualLocalIdUpdate();
            setReliantButtonLabel(button, 'Move to JP');
            refreshMainPageKeyDisplays();
        }
    }
    function getReportMoveDestination(reportItem) {
        if (!reportItem.textContent?.includes('moved from')) {
            return null;
        }
        const anchors = reportItem.querySelectorAll('a');
        if (anchors.length < 3) {
            return null;
        }
        const movedFromNation = anchors[0].textContent?.trim() ?? null;
        const myNation = document.querySelector('#current-wa-nation')?.textContent?.trim() ?? null;
        if (movedFromNation === myNation) {
            return null;
        }
        return anchors[2].textContent?.trim() ?? null;
    }
    function setReportDestinationRegionState(reportItem, chaseable, blocked) {
        const anchors = reportItem.querySelectorAll('a');
        if (anchors.length < 3) {
            return;
        }
        anchors[2].classList.toggle('chaseable-region-destination', chaseable);
        anchors[2].classList.toggle('blocked-region-destination', blocked);
    }
    async function getBlockedRegionKeys() {
        const blockedRegions = await getStorageValue('blockedregions') || [];
        return new Set(blockedRegions.map((region) => canonicalize(region)));
    }
    async function isBlockedDestination(regionName, blockedRegionKeys) {
        const regionKey = canonicalize(regionName);
        const jumpPoint = canonicalize(await getStorageValue('jumppoint') || '');
        return Boolean(regionKey && regionKey !== jumpPoint && blockedRegionKeys.has(regionKey));
    }
    async function isChaseableDestination(regionName, blockedRegionKeys) {
        const regionKey = canonicalize(regionName);
        if (!regionKey || blockedRegionKeys.has(regionKey)) {
            return false;
        }
        return !(await shouldSuppressChaseDestination(regionName));
    }
    async function refreshChaseReportHighlights() {
        const ulElement = document.querySelector('#reports');
        if (!ulElement) {
            return;
        }
        const blockedRegionKeys = await getBlockedRegionKeys();
        for (const reportItem of Array.from(ulElement.querySelectorAll('li'))) {
            const moveDestination = getReportMoveDestination(reportItem);
            if (!moveDestination) {
                setReportDestinationRegionState(reportItem, false, false);
                continue;
            }
            setReportDestinationRegionState(reportItem, await isChaseableDestination(moveDestination, blockedRegionKeys), await isBlockedDestination(moveDestination, blockedRegionKeys));
        }
    }
    async function getMovedToRegion() {
        const ulElement = document.querySelector('#reports');
        if (!ulElement) {
            return null;
        }
        const blockedRegionKeys = await getBlockedRegionKeys();
        for (const reportItem of Array.from(ulElement.querySelectorAll('li'))) {
            const moveDestination = getReportMoveDestination(reportItem);
            if (!moveDestination) {
                continue;
            }
            const chaseable = await isChaseableDestination(moveDestination, blockedRegionKeys);
            setReportDestinationRegionState(reportItem, chaseable, await isBlockedDestination(moveDestination, blockedRegionKeys));
            if (chaseable) {
                return moveDestination;
            }
        }
        return null;
    }
    async function updateOccupationSequence(newSequence) {
        await setStorageValue('occupationsequence', newSequence);
        document.querySelector('#occupation-sequence').innerHTML = newSequence;
        await persistChaseAssistState(newSequence);
    }
    async function performOccupationSequence() {
        await performOneKeyChaseAction();
    }
    async function performTargetChaseStep() {
        if (chaseAssistStep === 'target-update-localid') {
            await updateOccupationSequence('Updating localid');
            await manualLocalIdUpdate();
            chaseAssistStep = 'target-update-status';
            await persistChaseAssistState();
            status.innerHTML = 'Updated localid. Press move key to update region status.';
            return;
        }
        if (chaseAssistStep === 'target-update-status') {
            await updateOccupationSequence('Updating target');
            await updateRegionStatus({ target: null });
            chaseAssistStep = 'target-endorse-delegate';
            await persistChaseAssistState();
            status.innerHTML = 'Updated region status. Press move key to endorse delegate.';
            return;
        }
        const delegateNation = document.querySelector('#delegate-nation').value;
        if (delegateNation && delegateNation !== 'N/A' && chaseAssistStep === 'target-endorse-delegate') {
            await updateOccupationSequence('Endorsing delegate');
            const endorseResult = await endorseDelegateAsync();
            chaseAssistStep = 'return-move-jp';
            await updateOccupationSequence('Returning JP');
            await persistChaseAssistState();
            status.innerHTML = endorseResult.success ?
                `${endorseResult.message} Press move key to return to JP.` :
                `${endorseResult.message} Continuing; press move key to return to JP.`;
            return;
        }
        chaseAssistStep = 'return-move-jp';
        await updateOccupationSequence('Returning JP');
        await persistChaseAssistState();
        status.innerHTML = 'Target handled. Press move key to return to JP.';
    }
    async function performReturnToJpStep(jumpPoint, currentRegionKey) {
        if (currentRegionKey !== canonicalize(jumpPoint)) {
            await updateOccupationSequence('Moving to JP');
            if (await moveNationToRegion(jumpPoint)) {
                chaseAssistStep = 'return-update-localid';
                await persistChaseAssistState();
                status.innerHTML = `Returned to ${jumpPoint}. Press move key to update localid.`;
            }
            else {
                status.innerHTML = `Failed to return to ${jumpPoint}.`;
            }
            return;
        }
        if (chaseAssistStep === 'return-update-localid') {
            await updateOccupationSequence('Updating localid');
            await manualLocalIdUpdate();
            chaseAssistStep = 'return-resign';
            await persistChaseAssistState();
            status.innerHTML = 'Updated localid after returning to JP. Press move key to resign.';
            return;
        }
        await updateOccupationSequence('Resigning');
        if (await resignWaAsync(true)) {
            if (consumePendingOccupationMoveKey()) {
                status.innerHTML = 'Resigned from WA. Processing buffered move key to admit next switcher.';
                setTimeout(() => void performOccupationSequence(), 0);
                return;
            }
            status.innerHTML = 'Resigned from WA. Press move key to admit next switcher.';
        }
    }
    async function chaseReportMove(moveRegion, currentRegionKey) {
        await updateOccupationSequence('Chasing target');
        if (canonicalize(moveRegion) === currentRegionKey) {
            chaseAssistStep = 'target-update-localid';
            chaseAssistTargetRegion = moveRegion;
            chaseAssistIdleBootstrappedThisSession = false;
            resetRegionStatusDetails();
            await persistChaseAssistState();
            status.innerHTML = `Already in ${moveRegion}. Press move key to update localid.`;
            return;
        }
        if (await moveNationToRegion(moveRegion)) {
            chaseAssistStep = 'target-update-localid';
            chaseAssistTargetRegion = moveRegion;
            chaseAssistIdleBootstrappedThisSession = false;
            resetRegionStatusDetails();
            await persistChaseAssistState();
            status.innerHTML = `Moved to ${moveRegion}. Press move key to update localid.`;
        }
        else {
            status.innerHTML = `Failed to move to ${moveRegion}.`;
        }
    }
    async function performOneKeyChaseAction() {
        if (inQuery) {
            status.innerHTML = 'Reliant is already waiting on NationStates.';
            return;
        }
        await restoreChaseAssistState();
        if (chaseAssistStep === 'admit-next-switcher') {
            await updateOccupationSequence('Admitting');
            await admitWaAsync();
            await persistChaseAssistState();
            return;
        }
        const currentWa = await getStorageValue('currentwa');
        if (!currentWa || canonicalize(currentWa) === 'n/a' || !isCurrentRegionKnown()) {
            await updateOccupationSequence('Checking identity');
            if (await refreshLoggedInNationAndRegion()) {
                chaseAssistStep = 'jp-update-localid';
                await updateOccupationSequence('Updating localid');
                status.innerHTML = 'Refreshed current region. Press move key to update localid.';
            }
            else {
                await persistChaseAssistState('Checking identity');
            }
            return;
        }
        const jumpPoint = await getStorageValue('jumppoint') || 'artificial_solar_system';
        const currentRegionKey = canonicalize(currentRegion.innerHTML);
        const jumpPointKey = canonicalize(jumpPoint);
        if (chaseAssistStep === 'target-update-localid' ||
            chaseAssistStep === 'target-update-status' ||
            chaseAssistStep === 'target-endorse-delegate') {
            await performTargetChaseStep();
            return;
        }
        const moveRegion = await getMovedToRegion();
        if (moveRegion) {
            await chaseReportMove(moveRegion, currentRegionKey);
            return;
        }
        if (chaseAssistStep === 'return-move-jp' || chaseAssistStep === 'return-update-localid' || chaseAssistStep === 'return-resign') {
            await performReturnToJpStep(jumpPoint, currentRegionKey);
            return;
        }
        if (currentRegionKey !== jumpPointKey) {
            chaseAssistStep = 'target-update-localid';
            chaseAssistTargetRegion = currentRegion.innerHTML;
            resetRegionStatusDetails();
            await updateOccupationSequence('Chasing target');
            await persistChaseAssistState();
            status.innerHTML = 'Current region treated as target. Press move key to update localid.';
            return;
        }
        if (chaseAssistStep === 'jp-update-localid') {
            await updateOccupationSequence('Updating localid');
            await manualLocalIdUpdate();
            chaseAssistStep = 'idle';
            await persistChaseAssistState();
            status.innerHTML = 'Updated localid. Press move key to continue watching.';
            return;
        }
        if (!chaseAssistIdleBootstrappedThisSession) {
            await updateOccupationSequence('Refreshing idle');
            await refreshEndorseAsync();
            await refreshDossierAsync();
            chaseAssistStep = 'watching-stream';
            chaseAssistIdleBootstrappedThisSession = true;
            await persistChaseAssistState();
            status.innerHTML = 'Refreshed JP endorsements and raider dossier once. Watching stream.';
            return;
        }
        if (await endorseNextPendingJpNation()) {
            chaseAssistStep = 'endorsing-jp';
            await updateOccupationSequence('Endorsing JP');
            return;
        }
        chaseAssistStep = 'watching-stream';
        await updateOccupationSequence('Watching stream');
        status.innerHTML = 'Watching stream for moves and endorse candidates.';
    }
    async function chasingButton(e) {
        const occupationMode = await getStorageValue('occupationmode') || false;
        if (occupationMode) {
            // In occupation mode, use the sequence logic
            await performOccupationSequence();
            return;
        }
        // Original chasing logic for non-occupation mode
        const moveRegion = await getMovedToRegion();
        const button = e.target;
        if (getReliantButtonLabel(button) == 'Update Localid') {
            await manualLocalIdUpdate();
            setReliantButtonLabel(button, 'Refresh');
            refreshMainPageKeyDisplays();
        }
        else if (moveRegion) {
            if (await moveNationToRegion(moveRegion)) {
                status.innerHTML = `Moved to ${moveRegion}`;
            }
            else {
                status.innerHTML = `Failed to move to ${moveRegion}.`;
            }
            setReliantButtonLabel(button, 'Update Localid');
            button.setAttribute('data-moveregion', '');
            refreshMainPageKeyDisplays();
            resetRegionStatusDetails();
        }
        else {
            status.innerHTML = 'No valid movement detected.';
        }
    }
    function resetRegionDetagButton() {
        setRegionUpdateButtonState('update');
        regionalOfficersToDismiss = [];
        secondRoAttempt = false;
    }
    function getRegionUpdateButtonState() {
        const value = getReliantButtonLabel(updateRegionStatusButton);
        for (const [state, config] of Object.entries(REGION_UPDATE_BUTTON_STATES)) {
            const iconLabel = `${config.icon} ${config.label}`;
            if (value === config.label || value === iconLabel)
                return state;
        }
        return 'update';
    }
    function setRegionUpdateButtonState(state) {
        const config = REGION_UPDATE_BUTTON_STATES[state] || REGION_UPDATE_BUTTON_STATES.update;
        setReliantButtonLabel(updateRegionStatusButton, `${config.icon} ${config.label}`);
        updateRegionStatusButton.classList.add('ns-icon-button');
        updateRegionStatusButton.classList.toggle('nation-action-button', config.nationAction);
        refreshMainPageKeyDisplays();
    }
    async function getRegionalOfficersToDismiss(regionName) {
        const response = await makeAjaxQuery(`/template-overall=none/region=${regionName}`, 'GET');
        const responseElement = document.createRange().createContextualFragment(response);
        const officerBoxes = responseElement.querySelectorAll('.officerbox');
        const officerNames = [];
        const delegateRegex = new RegExp('nation=(.+)');
        for (let i = 0; i !== officerBoxes.length; i++) {
            const quietLink = officerBoxes[i].querySelector('.quietlink');
            if (quietLink === null)
                continue;
            else if (quietLink.innerHTML.indexOf('Governor') !== -1)
                continue;
            else if (quietLink.innerHTML.indexOf('WA Delegate') !== -1)
                continue;
            const nationLink = officerBoxes[i].querySelector('.nlink');
            const nationHref = nationLink?.getAttribute('href');
            const officerName = nationHref ? delegateRegex.exec(nationHref)?.[1] : null;
            if (officerName)
                officerNames.push(officerName);
        }
        return officerNames;
    }
    async function dismissRegionalOfficer(regionName) {
        if (regionalOfficersToDismiss.length === 0) {
            setRegionUpdateButtonState('appointSelfRo');
            status.innerHTML = 'No ROs left to dismiss. Press update to appoint yourself as RO.';
            return;
        }
        const chk = await getStorageValue('chk');
        const officerName = regionalOfficersToDismiss[0];
        const formData = new FormData();
        formData.set('nation', officerName);
        formData.set('page', 'region_control');
        formData.set('region', regionName);
        formData.set('chk', chk);
        formData.set('abolishofficer', '1');
        await makeAjaxQuery(`/page=region_control/region=${regionName}`, 'POST', formData);
        regionalOfficersToDismiss.shift();
        status.innerHTML = `Dismissed RO ${pretty(officerName)}.`;
        if (regionalOfficersToDismiss.length === 0)
            setRegionUpdateButtonState('appointSelfRo');
    }
    async function appointSelfAsRegionalOfficer(regionName) {
        const chk = await getStorageValue('chk');
        const currentNation = await getStorageValue('currentwa');
        const roName = await getStorageValue('roname');
        const formData = new FormData();
        formData.set('page', 'region_control');
        formData.set('region', regionName);
        formData.set('chk', chk);
        formData.set('nation', currentNation);
        formData.set('office_name', roName);
        formData.set('authority_A', '1');
        formData.set('authority_B', '0');
        formData.set('authority_C', '1');
        formData.set('authority_E', '1');
        formData.set('authority_P', '1');
        formData.set('editofficer', '1');
        const response = await makeAjaxQuery(`/page=region_control/region=${regionName}`, 'POST', formData);
        const responseElement = document.createRange().createContextualFragment(response);
        const responseInfo = responseElement.querySelector('.info') || responseElement.querySelector('.error');
        if (responseInfo?.innerHTML.indexOf('with authority') !== -1) {
            status.innerHTML = 'Successfully self appointed as RO.';
            setRegionUpdateButtonState('update');
            secondRoAttempt = false;
        }
        else {
            status.innerHTML = 'Failed to appoint self as RO.';
            if (!secondRoAttempt) {
                secondRoAttempt = true;
                return;
            }
            console.log(response);
            setRegionUpdateButtonState('update');
        }
    }
    async function updateRegionStatus(e) {
        const clickedButton = e?.target === updateRegionStatusButton;
        if (clickedButton) {
            // Keep manual refresh in sync: update WA identity/current region first, then region data.
            await refreshLoggedInNationAndRegion();
        }
        if (!isCurrentRegionKnown()) {
            await checkCurrentRegion();
            return;
        }
        const regionButtonState = getRegionUpdateButtonState();
        const regionName = currentRegion.innerHTML;
        if (clickedButton && regionButtonState === 'dismissRo') {
            await dismissRegionalOfficer(regionName);
            return;
        }
        else if (clickedButton && regionButtonState === 'appointSelfRo') {
            await appointSelfAsRegionalOfficer(regionName);
            return;
        }
        resetRegionDetagButton();
        // Use the API to fetch region data
        const response = await fetchWithRateLimit(`/cgi-bin/api.cgi?region=${regionName}&q=happenings+delegate+lastupdate`, {}, e?.target);
        const responseText = await response.text();
        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseText, "application/xml");
        // Get delegate information
        const delegateElement = xmlDoc.querySelector('DELEGATE');
        const lastUpdateElement = xmlDoc.querySelector('LASTUPDATE');
        let delegateName = 'N/A';
        if (delegateElement && delegateElement.textContent) {
            delegateName = delegateElement.textContent;
            // Format delegate display similar to the original HTML version
            document.querySelector('#wa-delegate').innerHTML = `<span class="nname">${delegateName}</span>`;
            document.querySelector('#delegate-nation').value = delegateName;
        }
        else {
            document.querySelector('#wa-delegate').innerHTML = 'None.';
            document.querySelector('#delegate-nation').value = 'N/A';
        }
        // Update last WA update time
        let lastUpdateTime = 'N/A';
        if (lastUpdateElement && lastUpdateElement.textContent) {
            const lastUpdateTimestamp = Number(lastUpdateElement.textContent);
            lastUpdateTime = timeAgo(lastUpdateTimestamp);
            document.querySelector('#last-wa-update').innerHTML = lastUpdateTime;
        }
        else {
            document.querySelector('#last-wa-update').innerHTML = 'N/A';
        }
        if (clickedButton && lastUpdateTime.indexOf('hour') === -1) {
            const currentNation = await getStorageValue('currentwa');
            if (currentNation && canonicalize(currentNation) === canonicalize(delegateName)) {
                regionalOfficersToDismiss = await getRegionalOfficersToDismiss(regionName);
                status.innerHTML = 'Updated! You are the delegate.';
                setRegionUpdateButtonState(regionalOfficersToDismiss.length === 0 ? 'appointSelfRo' : 'dismissRo');
            }
        }
        // Update region happenings
        regionHappenings.innerHTML = '';
        const happeningsData = parseApiHappenings(responseText);
        const happeningsText = happeningsData.text;
        const happeningsTimestamps = happeningsData.timestamps;
        await renderFormattedHappenings(regionHappenings, happeningsText, happeningsTimestamps);
    }
    async function checkCurrentRegion() {
        let response = await makeAjaxQuery('/page=upload_flag', 'GET');
        let responseElement = document.createRange().createContextualFragment(response);
        let regionHref = responseElement.querySelector('#panelregionbar > a').href;
        setCurrentRegion(new RegExp('region=([A-Za-z0-9_]+)').exec(regionHref)[1]);
    }
    function getDelegateEndorseMessage(nationName, endorseResult) {
        switch (endorseResult) {
            case 'endorsed':
                return { success: true, message: `Endorsed ${nationName}.` };
            case 'already-endorsed':
                return { success: true, message: `Already endorsed ${nationName}.` };
            case 'security-check-failed':
                return { success: false, message: `Failed to endorse ${nationName} (security check failed).` };
            case 'different-region':
                return { success: false, message: `Failed to endorse ${nationName} (different region).` };
            case 'non-wa-nation':
                return { success: false, message: `Failed to endorse ${nationName} (delegate is not in the WA).` };
            case 'error-page-redirect':
                return { success: false, message: `Failed to endorse ${nationName} (NationStates error page).` };
        }
    }
    async function endorseDelegateAsync() {
        const localId = await getStorageValue('localid');
        const nationName = document.querySelector('#delegate-nation').value;
        if (nationName === 'N/A') {
            const result = { success: false, message: 'No delegate to endorse.' };
            status.innerHTML = result.message;
            return result;
        }
        const endorseResult = await submitEndorsement(nationName, localId);
        const result = getDelegateEndorseMessage(nationName, endorseResult);
        status.innerHTML = result.message;
        return result;
    }
    async function endorseDelegate(e) {
        await endorseDelegateAsync();
    }
    async function checkIfUpdated(e) {
        const clickedButton = e.target;
        didIUpdate.innerHTML = '';
        const response = await fetchWithRateLimit(`/cgi-bin/api.cgi?q=happenings;view=nation.${currentWANation.innerHTML};filter=change`, {}, clickedButton);
        const xml = await response.text();
        const happeningsObject = await parseApiHappenings(xml);
        const happeningsText = happeningsObject.text;
        const happeningsTimestamps = happeningsObject.timestamps;
        // limit to max 3 happenings to save space
        await renderFormattedHappenings(didIUpdate, happeningsText.slice(0, 3), happeningsTimestamps.slice(0, 3));
    }
    async function updateWorldHappenings(e) {
        const clickedButton = e?.target;
        worldHappenings.innerHTML = '';
        const response = await fetchWithRateLimit('/cgi-bin/api.cgi?q=happenings;filter=move+member+endo', {}, clickedButton);
        const responseText = await response.text();
        const happeningsResponse = parseApiHappenings(responseText);
        const happeningsText = happeningsResponse.text;
        const happeningsTimestamps = happeningsResponse.timestamps;
        await renderFormattedHappenings(worldHappenings, happeningsText, happeningsTimestamps);
    }
    function copyWin(e) {
        copyTextToClipboard(`W: https://www.nationstates.net/region=${currentRegion.innerHTML}`);
    }
    function copyOrders(e) {
        const delegateNation = document.querySelector('#delegate-nation').value;
        if (document.querySelector('#last-wa-update').innerHTML.indexOf('hour') === -1)
            return;
        else if (delegateNation.indexOf('N/A') !== -1)
            return;
        copyTextToClipboard(`@here **NOW**\nMove to: https://www.nationstates.net/region=${currentRegion.innerHTML}\nThen endorse: https://www.nationstates.net/nation=${canonicalize(delegateNation)}`);
    }
    function copyNationLink(e) {
        const nation = canonicalize(currentWANation.innerHTML);
        if (!nation || nation === 'n/a') {
            return;
        }
        copyTextToClipboard(`https://www.nationstates.net/nation=${nation}`);
    }
    function openRegion(e) {
        const regionUrl = document.querySelector('#current-region').innerHTML;
        window.open(`/region=${regionUrl}`);
    }
    // Update the list of switchers as soon as a new WA admit page is opened
    // also update the EventSource whenever tracked nation changes
    function onStorageChange(changes) {
        for (let key in changes) {
            let storageChange = changes[key];
            if (key === 'switchers') {
                const newSwitchers = storageChange.newValue || [];
                document.querySelector('#num-switchers').innerHTML = String(newSwitchers.length);
                const chasingButton = document.querySelector('#chasing-button');
                if (newSwitchers.length > 0 && getReliantButtonLabel(chasingButton) === 'No Switchers') {
                    setReliantButtonLabel(chasingButton, 'Refresh');
                    chasingButton.disabled = false;
                    refreshMainPageKeyDisplays();
                }
            }
            else if (key === 'currentwa') {
                updateWANationDisplay(currentWANation, storageChange.newValue || 'N/A');
                refreshMainPageKeyDisplays();
            }
            else if (key === 'occupationmode') {
                updateOccupationModeDisplay(Boolean(storageChange.newValue));
                if (!storageChange.newValue) {
                    resetChaseAssistState();
                    void setStorageValue('occupationsequence', 'Ready');
                    void persistChaseAssistState('Ready');
                }
            }
            else if (key === 'operationmode') {
                applyOperationMode(storageChange.newValue || 'defending');
            }
            else if (key === 'occupationsequence') {
                const occupationSequence = document.querySelector('#occupation-sequence');
                occupationSequence.innerHTML = storageChange.newValue;
            }
            else if (key === 'trackednations') {
                // Clear any existing reconnect timeout
                if (sseReconnectTimeout) {
                    clearTimeout(sseReconnectTimeout);
                }
                const newTrackedNations = storageChange.newValue || [];
                const addedCount = newTrackedNations.length - (nationsTracked?.length || 0);
                // Update local tracking immediately for UI responsiveness
                nationsTracked = newTrackedNations;
                renderTrackedDossierNations();
                // Show immediate feedback that nations are being tracked
                if (addedCount > 0) {
                    // Don't override important status messages
                    const currentStatus = status.innerHTML;
                    if (!currentStatus.includes('Failed') && !currentStatus.includes('Error')) {
                        if (addedCount === 1) {
                            // Keep the specific nation tracking message from the button click
                        }
                        else {
                            status.innerHTML = `Tracking ${addedCount} new nations. Updates starting soon...`;
                        }
                    }
                }
                // Debounce SSE reconnection to prevent 429 errors
                sseReconnectTimeout = setTimeout(() => {
                    buildSSEUrl(newTrackedNations).then((url) => {
                        // Use the connection function with retry logic
                        createSSEConnection(url);
                        sseReconnectTimeout = null;
                    });
                }, SSE_DEBOUNCE_DELAY); // Wait 2 seconds before reconnecting
            }
            else if (key === 'raiderjp' || key === 'jumppoint' || key === 'blockedregions' || key === 'currentwa') {
                if (key === 'raiderjp') {
                    document.querySelector('#raider-jp').value = storageChange.newValue || '';
                }
                if (key === 'jumppoint' || key === 'blockedregions') {
                    void refreshChaseReportHighlights();
                }
                reconnectSSE();
            }
            else if (key === UPDATE_PREDICTOR_REGION_KEY) {
                updatePredictorRegionKey = canonicalize(storageChange.newValue || '');
                updatePredictorRegionInput.value = updatePredictorRegionKey;
                void renderUpdatePredictor();
                reconnectSSE();
            }
            else if (key === UPDATE_PREDICTOR_ALERT_SECONDS_KEY) {
                updatePredictorAlertSecondsThreshold = Number(storageChange.newValue) ||
                    UPDATE_PREDICTOR_DEFAULT_ALERT_SECONDS_THRESHOLD;
                updatePredictorTriggerSecondsInput.value = String(updatePredictorAlertSecondsThreshold);
            }
        }
    }
    function updateOccupationModeDisplay(isEnabled) {
        const occupationStatus = document.querySelector('#occupation-status');
        occupationStatus.innerHTML = isEnabled ? 'Enabled' : 'Disabled';
        document.querySelectorAll('.occupation-sequence-display').forEach((element) => {
            element.classList.toggle('hidden', !isEnabled);
        });
    }
    /*
     * Event Listeners
     */
    document.querySelector('#resign').addEventListener('click', resignWA);
    document.querySelector('#admit').addEventListener('click', admitWA);
    document.querySelector('#refresh-endorse').addEventListener('click', refreshEndorse);
    document.querySelector('#manual-endorse').addEventListener('click', manualEndorse);
    document.querySelector('#update-predictor-endorse').addEventListener('click', updatePredictorEndorse);
    document.querySelector('#refresh-dossier').addEventListener('click', refreshDossier);
    document.querySelector('#add-manual-dossier-nation').addEventListener('click', addManualDossierNation);
    document.querySelector('#set-raider-jp').addEventListener('click', setRaiderJP);
    document.querySelector('#move-to-jp').addEventListener('click', moveToJP);
    document.querySelector('#chasing-button').addEventListener('click', chasingButton);
    document.querySelector('#update-localid').addEventListener('click', manualLocalIdUpdate);
    document.querySelector('#update-region-status').addEventListener('click', updateRegionStatus);
    document.querySelector('#check-if-updated').addEventListener('click', checkIfUpdated);
    document.querySelector('#copy-win').addEventListener('click', copyWin);
    document.querySelector('#copy-nation-link').addEventListener('click', copyNationLink);
    document.querySelector('#endorse-delegate').addEventListener('click', endorseDelegate);
    document.querySelector('#update-world-happenings').addEventListener('click', updateWorldHappenings);
    document.querySelector('#open-region').addEventListener('click', openRegion);
    document.querySelector('#copy-orders').addEventListener('click', copyOrders);
    document.querySelector('#appearance-toggle').addEventListener('click', toggleAppearanceSettings);
    document.querySelector('#appearance-background-image').addEventListener('change', loadDraftAppearanceImage);
    document.querySelector('#appearance-remove-background-image').addEventListener('click', removeDraftAppearanceImage);
    document.querySelector('#appearance-background-color').addEventListener('input', updateDraftAppearanceFromInputs);
    document.querySelector('#appearance-background-amount').addEventListener('input', updateDraftAppearanceFromInputs);
    document.querySelector('#appearance-panel-amount').addEventListener('input', updateDraftAppearanceFromInputs);
    document.querySelector('#appearance-panel-blur').addEventListener('input', updateDraftAppearanceFromInputs);
    document.querySelector('#appearance-save').addEventListener('click', saveDraftAppearance);
    document.querySelector('#set-update-predictor-region').addEventListener('click', setUpdatePredictorRegion);
    document.querySelector('#set-update-predictor-trigger-seconds').addEventListener('click', setUpdatePredictorTriggerSeconds);
    document.querySelector('#refresh-update-predictor-dump').addEventListener('click', manualRefreshUpdatePredictorDump);
    document.querySelector('#update-localid-update-predictor').addEventListener('click', manualLocalIdUpdate);
    document.querySelector('#move-to-update-predictor-region').addEventListener('click', moveToUpdatePredictorRegion);
    updatePredictorRegionInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            setUpdatePredictorRegion();
        }
    });
    document.addEventListener('keyup', keyPress);
    chrome.storage.onChanged.addListener(onStorageChange);
    await restoreChaseAssistState();
    /*
     * Initialization
     */
    chrome.storage.local.get(['switchers', 'currentwa', 'operationmode', 'occupationmode', 'occupationsequence', 'raiderjp'], async (result) => {
        try {
            document.querySelector('#num-switchers').innerHTML = result.switchers.length;
        }
        catch (e) {
            // no wa links in storage, do nothing
            if (e instanceof TypeError) { }
        }
        updateWANationDisplay(currentWANation, result.currentwa || 'N/A');
        const occupationSequence = document.querySelector('#occupation-sequence');
        document.querySelector('#raider-jp').value = result.raiderjp || '';
        occupationSequence.innerHTML = result.occupationsequence || 'Ready';
        updateOccupationModeDisplay(Boolean(result.occupationmode));
        applyOperationMode(result.operationmode || 'defending');
        renderTrackedDossierNations();
        await restoreChaseAssistState();
    });
    resetUpdatePredictorLiveState();
    updatePredictorTriggerSecondsInput.value = String(updatePredictorAlertSecondsThreshold);
    await initializeUpdatePredictor();
    updatePredictorEarlierWheelElement.addEventListener('scroll', () => {
        updateUpdatePredictorEarlierCenteredItem();
    });
    window.addEventListener('resize', () => {
        updateUpdatePredictorWheelEdgePadding();
        updateUpdatePredictorEarlierCenteredItem();
    });
    setInterval(() => { void renderUpdatePredictor(); }, 15 * 1000);
})();
