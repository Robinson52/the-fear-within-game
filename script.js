function initializeGame() {
    const get = (id) => document.getElementById(id);

    const titleScreen = get("title-screen");
    const introScreen = get("intro-screen");
    const episodeScreen = get("episode-screen");
    const gameScreen = get("game-screen");


    const startButton = get("start-button");
    const skipIntroButton = get("skip-intro-button");
    const helpButton = get("help-button");
    const helpText = get("help-text");

    const sceneLabel = get("scene-label");
    const sceneTitle = get("scene-title");
    const storyText = get("story-text");
    const actionButton = get("action-button");
    const listenButton = get("listen-button");
    const inventory = get("inventory");
    const objectiveBubble = get("objective-bubble");

    if (
        !titleScreen ||
        !gameScreen ||
        !startButton ||
        !storyText ||
        !actionButton
    ) {
        console.error("A required game element is missing.");
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const INTRO_VOLUME = 0.2;
    const EPISODE_DURATION = 4500;
    const OBJECTIVE_DURATION = 4200;
    const STAIR_FOOTSTEP_DURATION = 8000;
    const RUN_DURATION = 3000;

    // Optional: add a separate figure soundtrack here.
    const FIGURE_MUSIC_FILE = "";

    const endingAssets = {
        stairs: "images/Warm Anime Stairway Ascent.jpg",
        bed: "images/Ravens bed.jpg",
        ceiling: "images/ceiling.jpg",
        punch: "images/red punch bowl.jpg",
        ellie: "images/Ellie Laughing.jpeg",
        corridor: "videos/party_lights_flicker.mp4"
    };

    const introMusic = get("intro-music");
    const westAmbience = get("west-ambience");
    const scrubbingSound = get("scrubbing-sound");
    const knockSound = get("knock-sound");
    const westVideo = get("west-video");

    function configureAudio(audio, volume, loop = false) {
        if (!audio) return;

        audio.volume = volume;
        audio.loop = loop;
        audio.preload = "auto";
    }

    configureAudio(introMusic, INTRO_VOLUME, true);
    configureAudio(westAmbience, 0.3, true);
    configureAudio(scrubbingSound, 0.35, true);
    configureAudio(knockSound, 0.5);

    function makeAudio(source, volume, loop = false) {
        const audio = new Audio(source);

        configureAudio(audio, volume, loop);

        audio.addEventListener("error", () => {
            console.error("Could not load audio:", source);
        });

        return audio;
    }

    const footstepsSound = makeAudio(
        "audio/freesound_community-indoor-footsteps-6385.mp3",
        0.35
    );

    const upstairsFootstepsSound = makeAudio(
        "audio/freesound_community-indoor-footsteps-6385.mp3",
        0.5,
        true
    );

    const runningSound = makeAudio(
        "audio/freesound_community-running-sounds-6003.mp3",
        0.55,
        true
    );

    const doorOpenSound = makeAudio(
        "audio/soundreality-opening-door-411632.mp3",
        0.5
    );

    const doorCloseSound = makeAudio(
        "audio/soundreality-door-closing-2-455060.mp3",
        0.5
    );

    const doorSlamSound = makeAudio(
        "audio/freesound_community-wooden-door-slamming-close-79934.mp3",
        0.8
    );

    const outdoorMusic = makeAudio(
        "audio/freesound_community-spooky-ambiance-4-59511.mp3",
        0,
        true
    );

    const trashWhooshSound = makeAudio(
        "audio/dragon-studio-simple-whoosh-382724.mp3",
        0.55
    );

    const stairsMusic = makeAudio(
        "audio/freesound_community-suspense-creepy-ominous-ambience-14569.mp3",
        0,
        true
    );

   const heartbeatSound = makeAudio(
    "audio/universfield-rapid-heartbeat-151928.mp3",
    0.3,
    true
);

const breathingSound = makeAudio(
    "audio/freesound_community-044538_female-heavy-breathing-62329.mp3",
    0.45,
    true
);

    const ravenCalmingVoice = makeAudio(
        "audio/ElevenLabs_2026-10-10T21_59_10_Natasha - Upset, Clear and Serious_pvc_sp100_s50_sb75_v4.mp3",
        0.55,
        false
    );

    const figureMusic = FIGURE_MUSIC_FILE
        ? makeAudio(FIGURE_MUSIC_FILE, 0, true)
        : null;

    const sceneMusicTracks = [
        outdoorMusic,
        stairsMusic,
        figureMusic
    ].filter(Boolean);

    const movementSounds = [
        footstepsSound,
        upstairsFootstepsSound,
        runningSound,
        doorOpenSound,
        doorCloseSound
    ];

    function stopAudio(audio) {
        if (!audio) return;

        audio.pause();

        try {
            audio.currentTime = 0;
        } catch {
            // The file may still be loading.
        }
    }

    function playAudio(audio) {
        if (!audio) return;

        audio.muted = false;

        const promise = audio.play();

        promise?.catch((error) => {
            console.warn(
                "Could not start audio:",
                audio.currentSrc || audio.src,
                error.message
            );
        });
    }

    function playSilentVideo(video) {
        video.muted = true;

        const promise = video.play();

        promise?.catch((error) => {
            console.warn(
                "Could not start video:",
                video.currentSrc || video.src,
                error.message
            );
        });

        return promise;
    }

    function createVideo(id, source, poster = "", loop = true) {
        let video = get(id);

        if (!video) {
            video = document.createElement("video");
            video.id = id;
            gameScreen.prepend(video);
        }

        video.src = source;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = loop;
        video.playsInline = true;
        video.preload = "auto";
        video.hidden = true;

        video.setAttribute("playsinline", "");
        video.setAttribute("aria-hidden", "true");

        if (poster) video.poster = poster;

        video.addEventListener("error", () => {
            console.error("Could not load video:", source);
        });

        return video;
    }

    function createImage(id, source) {
        let image = get(id);

        if (!image) {
            image = document.createElement("img");
            image.id = id;
            gameScreen.prepend(image);
        }

        image.src = source;
        image.alt = "";
        image.hidden = true;
        image.setAttribute("aria-hidden", "true");

        image.addEventListener("error", () => {
            console.error("Could not load image:", source);
        });

        return image;
    }

    const stairsVideo = createVideo(
        "stairs-video",
        "videos/lamp_pulse.mp4",
        "images/Raven going upstairs.jpg"
    );

    const doorVideo = createVideo(
        "door-video",
        "videos/door_light_pulse.mp4"
    );

    const bulbVideo = createVideo(
        "bulb-video",
        "videos/flickering_bulb_loop.mp4"
    );

    const figureVideo = createVideo(
        "figure-video",
        "videos/flickering_bulb_loop.mp4"
    );

    const escapeVideo = createVideo(
        "escape-video",
        "videos/door_push_open_scared.mp4",
        "images/Pushing door .jpeg",
        false
    );

    const emptyLotImage = createImage(
        "empty-lot-image",
        "images/no shadow figure .jpg"
    );

    const peekingImage = createImage(
        "peeking-image",
        "images/peeking out.jpg"
    );

    const sceneVideos = [
        stairsVideo,
        doorVideo,
        bulbVideo,
        figureVideo,
        escapeVideo
    ];

    const unusedDumpsterVideo = get("dumpster-video");

    if (unusedDumpsterVideo) {
        unusedDumpsterVideo.pause();
        unusedDumpsterVideo.hidden = true;
        unusedDumpsterVideo.style.display = "none";
    }

    // Preload all still images used in the ending.
    const endingPreloads = Object.entries(endingAssets)
        .filter(([key]) => key !== "corridor")
        .map(([, source]) => {
            const image = new Image();
            image.src = source;

            image.addEventListener("error", () => {
                console.error("Could not load ending image:", source);
            });

            return image;
        });

    const endingLayer = document.createElement("div");
    endingLayer.id = "ending-layer";
    endingLayer.hidden = true;

    const endingImage = document.createElement("img");
    endingImage.id = "ending-image";
    endingImage.alt = "";
    endingImage.hidden = true;

    const endingCorridorVideo = createVideo(
        "ending-corridor-video",
        endingAssets.corridor,
        "",
        false
    );

    const endingShade = document.createElement("div");
    endingShade.id = "ending-shade";

    const endingCaption = document.createElement("p");
    endingCaption.id = "ending-caption";
    endingCaption.setAttribute("aria-live", "polite");

    const endingBlackout = document.createElement("div");
    endingBlackout.id = "ending-blackout";

    const endingFlash = document.createElement("div");
    endingFlash.id = "ending-flash";

    const endingTitle = document.createElement("div");
    endingTitle.id = "ending-title";
    endingTitle.hidden = true;

    const continuedHeading = document.createElement("h2");
    continuedHeading.textContent = "To be continued";

    const episodeComplete = document.createElement("p");
    episodeComplete.textContent = "End of Episode 1";

    endingTitle.append(continuedHeading, episodeComplete);

    endingLayer.append(
        endingImage,
        endingCorridorVideo,
        endingShade,
        endingCaption,
        endingBlackout,
        endingFlash,
        endingTitle
    );

    gameScreen.appendChild(endingLayer);

    let backButton = get("back-button");

    if (!backButton) {
        backButton = document.createElement("button");
        backButton.id = "back-button";
        gameScreen.appendChild(backButton);
    }

    backButton.type = "button";
    backButton.textContent = "← Back";

    Object.assign(backButton.style, {
        position: "absolute",
        top: "16px",
        right: "16px",
        zIndex: "100",
        pointerEvents: "auto"
    });

    let inventoryIcons = get("inventory-icons");

    if (!inventoryIcons) {
        inventoryIcons = document.createElement("div");
        inventoryIcons.id = "inventory-icons";
        inventoryIcons.setAttribute("role", "list");
        inventoryIcons.setAttribute("aria-label", "Inventory items");
        gameScreen.appendChild(inventoryIcons);
    }

    let suppliesHighlight = get("supplies-highlight");

    if (!suppliesHighlight) {
        suppliesHighlight = document.createElement("div");
        suppliesHighlight.id = "supplies-highlight";
        suppliesHighlight.setAttribute("aria-hidden", "true");
        gameScreen.appendChild(suppliesHighlight);
    }

    suppliesHighlight.hidden = true;

    suppliesHighlight.innerHTML = `
        <svg viewBox="0 0 1672 941" aria-hidden="true">
            <path d="
                M552 379 L536 330 L656 294 L668 318
                L680 249 L969 272 L958 365 L1014 349
                L975 391 L975 493 L876 562 L552 506 Z
            " />

            <path d="
                M998 529
                Q979 526 976 514 Q970 502 988 495
                L1014 482 Q1027 477 1043 487
                L1066 487 L1078 494 L1124 482
                Q1135 477 1141 488 L1150 503
                Q1190 514 1218 531 L1289 550
                Q1313 558 1306 572 Q1303 578 1291 575
                L1243 558 L1310 583
                Q1334 594 1321 604 Q1316 609 1304 605
                L1240 575 L1293 604
                Q1307 618 1290 623 Q1282 625 1271 618
                L1208 580 L1244 604
                Q1258 618 1242 623 Q1232 625 1221 617
                L1163 577 L1184 611
                Q1197 631 1178 636 Q1167 639 1159 625
                L1136 588 L1154 625
                Q1165 647 1144 650 Q1130 651 1122 635
                L1097 585 L1100 615
                Q1110 636 1092 642 Q1078 645 1069 631
                L1048 579 L1045 600
                Q1040 620 1025 617 Q1014 615 1010 599
                L999 552 Q996 539 998 529 Z
            " />
        </svg>
    `;

    let mediaStyles = get("figure-sequence-styles");

    if (!mediaStyles) {
        mediaStyles = document.createElement("style");
        mediaStyles.id = "figure-sequence-styles";
        document.head.appendChild(mediaStyles);
    }

    const mediaScenes = [
        "upstairs-scene",
        "return-door-scene",
        "bulb-scene",
        "parking-lot-figure-scene",
        "darkness-scene",
        "escape-scene",
        "peeking-scene"
    ];

    const mediaSelectors = mediaScenes.map(
        (name) => `#game-screen.${name}`
    );

    mediaStyles.textContent = `
        #game-screen {
            position: relative;
            isolation: isolate;
        }

        #game-screen [hidden] {
            display: none !important;
        }

        #game-screen #stairs-video,
        #game-screen #door-video,
        #game-screen #bulb-video,
        #game-screen #figure-video,
        #game-screen #escape-video,
        #game-screen #empty-lot-image,
        #game-screen #peeking-image {
            display: none;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
            pointer-events: none;
        }

        #game-screen.upstairs-scene #stairs-video:not([hidden]),
        #game-screen.return-door-scene #door-video:not([hidden]),
        #game-screen.bulb-scene #bulb-video:not([hidden]),
        #game-screen.parking-lot-figure-scene #figure-video:not([hidden]),
        #game-screen.darkness-scene #empty-lot-image:not([hidden]),
        #game-screen.escape-scene #escape-video:not([hidden]),
        #game-screen.peeking-scene #peeking-image:not([hidden]) {
            display: block !important;
        }

        ${mediaSelectors.map((s) => `${s}::before`).join(",")} {
            content: none !important;
            background: none !important;
            animation: none !important;
        }

        ${mediaSelectors.map((s) => `${s}::after`).join(",")} {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            background: linear-gradient(
                to bottom,
                transparent 35%,
                rgba(0, 0, 0, 0.85) 100%
            );
        }

        ${mediaSelectors.map((s) => `${s} #story-text`).join(",")},
        ${mediaSelectors.map((s) => `${s} #scene-title`).join(",")},
        ${mediaSelectors.map((s) => `${s} #scene-label`).join(",")} {
            position: relative;
            z-index: 2;
            color: #fff;
            text-shadow: 0 2px 8px #000;
        }

        #game-screen.escape-scene #story-text,
        #game-screen.peeking-scene #story-text {
            animation: none !important;
            opacity: 1;
            visibility: visible;
        }

        ${mediaSelectors
            .map((s) => `${s} #action-button:not([hidden])`)
            .join(",")},
        #game-screen.ending-montage-scene #action-button:not([hidden]) {
            display: block !important;
            position: relative !important;
            inset: auto !important;
            transform: none !important;
            z-index: 60;
            width: fit-content;
            max-width: 100%;
            margin: 24px auto 0;
            padding: 14px 24px;
            background: #8b1717;
            border: 1px solid #c74646;
            color: #fff;
            font: inherit;
            cursor: pointer;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            animation: none !important;
        }

        #game-screen.darkness-scene #empty-lot-image {
            filter: brightness(0.12);
        }

        #game-screen.peeking-scene #peeking-image {
            animation: peeking-camera 14s ease-out both;
        }

        @keyframes peeking-camera {
            from { transform: scale(1); }
            to { transform: scale(1.06); }
        }

        #game-screen #back-button,
        #game-screen #objective-bubble {
            z-index: 100;
        }

        #game-screen #supplies-highlight {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 3;
        }

        #game-screen #supplies-highlight svg {
            position: absolute;
            overflow: visible;
        }

        #game-screen #supplies-highlight path {
            fill: none;
            stroke: #ffe45e;
            stroke-width: 3;
            stroke-linejoin: round;
            stroke-linecap: round;
            vector-effect: non-scaling-stroke;
            filter: drop-shadow(
                0 0 4px rgba(255, 228, 94, 0.6)
            );
        }

        #game-screen #inventory-icons {
            position: relative;
            z-index: 2;
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 12px;
        }

        #game-screen #inventory-icons span {
            font-size: 24px;
        }

        #game-screen #objective-bubble.objective-active {
            position: absolute;
            top: 70px;
            left: 24px;
            width: fit-content;
            max-width: min(300px, calc(100% - 48px));
            margin: 0;
            padding: 12px 16px;
            background: rgba(12, 12, 12, 0.88);
            color: #ffe9a0;
            font-size: 15px;
            line-height: 1.5;
            text-align: left;
            pointer-events: none;
            animation: objective-notice 4.2s ease both;
        }

        #game-screen #objective-bubble::before {
            font-size: 11px;
            letter-spacing: 2px;
            margin-bottom: 6px;
        }

        @keyframes objective-notice {
            0% {
                opacity: 0;
                transform: translateY(-8px);
            }
            12%, 78% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-5px);
            }
        }

        #game-screen #ending-layer {
            position: absolute;
            inset: 0;
            z-index: 20;
            overflow: hidden;
            background: #000;
        }

        #ending-layer #ending-image,
        #ending-layer #ending-corridor-video {
            display: block;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            z-index: 0;
            pointer-events: none;
        }

        #ending-layer #ending-shade {
            position: absolute;
            inset: 0;
            z-index: 1;
            pointer-events: none;
            background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.08) 30%,
                rgba(0, 0, 0, 0.82) 100%
            );
        }

        #ending-layer #ending-caption {
            position: absolute;
            left: 50%;
            bottom: 12%;
            transform: translateX(-50%);
            width: min(85%, 760px);
            margin: 0;
            z-index: 2;
            color: #eee;
            font-family: Georgia, serif;
            font-size: clamp(16px, 2.2vw, 23px);
            font-style: italic;
            line-height: 1.7;
            text-align: center;
            text-shadow: 0 2px 12px #000;
            pointer-events: none;
        }

        #ending-layer #ending-blackout,
        #ending-layer #ending-flash {
            position: absolute;
            inset: 0;
            z-index: 3;
            opacity: 0;
            pointer-events: none;
        }

        #ending-layer #ending-blackout {
            background: #000;
        }

        #ending-layer #ending-flash {
            z-index: 4;
            background: #d8c4ad;
        }

        #ending-layer #ending-title {
            position: absolute;
            inset: 0;
            z-index: 5;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 24px;
            text-align: center;
            color: #eee;
        }

        #ending-layer #ending-title h2 {
            margin: 0;
            font-family: Georgia, serif;
            font-size: clamp(30px, 6vw, 58px);
            font-weight: normal;
            letter-spacing: 0.06em;
        }

        #ending-layer #ending-title p {
            margin-top: 20px;
            font-size: 13px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #a78b8b;
        }

        #game-screen.ending-montage-scene::before,
        #game-screen.ending-montage-scene::after {
            content: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
            #game-screen.peeking-scene #peeking-image {
                animation: none !important;
            }
        }
    `;

    const scenes = [
        {
            label: "5:00 AM · Living room",
            title: "Someone is at the door",
            text: "The pounding pulls me out of my thoughts. I cross the room, but the moment my hand reaches the handle, it stops.",
            action: "Open the door",
            inventory: "Empty",
            narration: true
        },
        {
            speaker: "Mr. West",
            text: "“It looks like you had a rough night.”",
            action: "Continue",
            inventory: "Empty",
            westVisible: true,
            westTalking: true
        },
        {
            text: "His voice is flat. There is no pity in it. No warmth.",
            action: "Continue",
            inventory: "Empty",
            westVisible: true,
            narration: true
        },
        {
            speaker: "Raven",
            text: "I blink hard. “What?”",
            action: "Continue",
            inventory: "Empty",
            westVisible: true
        },
        {
            speaker: "Mr. West",
            text: "“Don’t do that, Raven,” he snaps. “Look at the ground.”",
            action: "Look at the ground",
            inventory: "Empty",
            westVisible: true,
            westTalking: true
        },
        {
            text: "I look down. My black boots are sitting in a pool of greenish-yellow liquid.",
            action: "Continue",
            inventory: "Empty",
            bootsVisible: true,
            narration: true
        },
        {
            speaker: "Raven",
            text: "“I—I’m sorry, I just—”",
            action: "Continue",
            inventory: "Empty",
            westVisible: true
        },
        {
            speaker: "Mr. West",
            text: "“You’re already behind on rent. Clean this up. You have thirty minutes.”",
            action: "Go to the closet",
            inventory: "Empty",
            westVisible: true,
            westTalking: true
        },
        {
            text: "I close the door. His warning follows me down the hall as I head toward the closet.",
            action: "Open the closet",
            inventory: "Empty",
            narration: true,
            closesDoor: true
        },
        {
            text: "",
            action: "Take the supplies",
            inventory: "Empty",
            closetVisible: true,
            objective: "Clean up the mess."
        },
        {
            text: "What happened to me last night?",
            action: "Continue",
            inventory: "Gloves, cleaning supplies, trash bag",
            thought: true,
            scrubVisible: true,
            objective: "Clean up the mess."
        },
        {
            text: "I must have been drunk.",
            action: "Finish cleaning",
            inventory: "Gloves, cleaning supplies, trash bag",
            thought: true,
            scrubVisible: true,
            objective: "Clean up the mess."
        },
        {
            text: "Ew, the liquid remained on the seams of my boots. I can’t wear them again. I drop them into the bag with the dirty towels, peel off my gloves, and tie it shut.",
            action: "Throw out the trash",
            inventory: "Trash bag containing boots and cleaning materials",
            narration: true,
            baggingVisible: true,
            objective: "Take out the trash."
        },
        {
            text: "*sigh* Now I need to take it down to the dumpster.",
            action: "Go downstairs",
            inventory: "Trash bag",
            narration: true,
            objective: "Take out the trash."
        },
        {
            text: "I grip the bag and head down the stairs. At the bottom, I stop for a moment and listen.",
            action: "Look toward the dumpster",
            inventory: "Trash bag",
            narration: true,
            stairsVisible: true,
            outside: true,
            objective: "Watch your surroundings."
        },
        {
            text: "The dumpster sits to my right. I scan the parking lot, then glance back toward the stairs. Nothing moves. I keep the bag close and approach.",
            action: "Throw the bag into the dumpster",
            inventory: "Trash bag",
            narration: true,
            dumpsterApproachVisible: true,
            outside: true,
            throwsTrash: true,
            objective: "Watch your surroundings."
        },
        {
            text: "I toss the bag into the dumpster. It lands with a dull thud. I turn back toward the stairs.",
            action: "Head back upstairs",
            inventory: "Empty",
            narration: true,
            dumpsterVisible: true,
            outside: true
        },
        {
            text: "I quickly headed back up to the second floor, but once I touched the steps, the light above began pulsing with each step I took.",
            action: "Run upstairs",
            inventory: "Empty",
            narration: true,
            upstairsVisible: true,
            objective: "Get back to your apartment."
        },
        {
            text: "When I reached my door, I froze, my hand resting on the metal handle. The flickering slowed.",
            action: "",
            inventory: "Empty",
            narration: true,
            doorVisible: true,
            automaticDuration: 7000,
            fadeBeforeNext: true
        },
        {
            text: "My body grew heavy, my heartbeat syncing with the rhythm of the lights.",
            action: "Look up at the light",
            inventory: "Empty",
            narration: true,
            doorVisible: true,
            heartbeat: true
        },
        {
            text: "Between the pulses…",
            action: "Look down at the parking lot",
            inventory: "Empty",
            narration: true,
            bulbVisible: true,
            suspense: true,
            heartbeat: true
        },
        {
            text: "I caught the jagged outline of something standing down in the parking lot.",
            action: "Continue",
            inventory: "Empty",
            narration: true,
            parkingLotFigureVisible: true,
            figureEncounter: true,
            suspense: true,
            heartbeat: true
        },
        {
            text: "On. A silhouette.",
            action: "",
            inventory: "Empty",
            narration: true,
            parkingLotFigureVisible: true,
            restartFigure: true,
            figureEncounter: true,
            suspense: true,
            heartbeat: true,
            instantText: true,
            automaticDuration: 3000
        },
        {
            text: "Off. Darkness.",
            action: "Get inside",
            inventory: "Empty",
            narration: true,
            darknessVisible: true,
            figureEncounter: true,
            suspense: true,
            heartbeat: true,
            instantText: true
        },
        {
            text: "I moved before the next flash came, yanking the door open and bolted inside, slamming it shut behind me.",
            action: "Peek through the blinds",
            inventory: "Empty",
            narration: true,
            escapeVisible: true,
            figureEncounter: true,
            suspense: true,
            heartbeat: true
        },
        {
            text: "I stood there for a second longer, then slowly reached out and peeled back the blinds just enough for a glance.",
            action: "Go to bed",
            inventory: "Empty",
            narration: true,
            heartbeat: true,
            peekingVisible: true
        },
        {
            text: "",
            action: "Return to title",
            inventory: "Empty",
            heartbeat: true,
            endingMontage: true
        }
    ];

    const sceneClassMap = {
        westVisible: "west-scene",
        narration: "narration-scene",
        bootsVisible: "boots-scene",
        closetVisible: "closet-scene",
        scrubVisible: "scrubbing-scene",
        thought: "thought-scene",
        baggingVisible: "bagging-scene",
        stairsVisible: "stairs-scene",
        dumpsterApproachVisible: "dumpster-approach-scene",
        dumpsterVisible: "dumpster-scene",
        upstairsVisible: "upstairs-scene",
        doorVisible: "return-door-scene",
        bulbVisible: "bulb-scene",
        parkingLotFigureVisible: "parking-lot-figure-scene",
        darknessVisible: "darkness-scene",
        escapeVisible: "escape-scene",
        peekingVisible: "peeking-scene",
        endingMontage: "ending-montage-scene"
    };

    const sceneClasses = [
        ...Object.values(sceneClassMap),
        "door-scene",
        "raven-speaking",
        "escape-black"
    ];

    let currentScene = 0;
    let sceneRevision = 0;

    let introTimer = null;
    let introAnimation = null;
    let introRunning = false;

    let episodeTimer = null;
    let episodeAnimation = null;
    let episodeRunning = false;

    let introFadeFrame = null;
    let sceneMusicFrame = null;
    let endingAudioFrame = null;
    let activeSceneMusic = null;

    let movementTimer = null;
    let objectiveTimer = null;
    let previousObjective = "";
    let isRunningUpstairs = false;
    let objectiveAudioContext = null;

    let textAnimations = [];
    let endingAnimations = [];
    let endingImageAnimation = null;

    const sceneTimers = new Map();
    let escapeCleanup = null;

    function clamp(value) {
        return Math.max(0, Math.min(1, value));
    }

    function sceneIsCurrent(revision) {
        return (
            revision === sceneRevision &&
            !gameScreen.hidden
        );
    }

    // All scene delays can be cancelled when going back.
    function sceneWait(duration) {
        return new Promise((resolve) => {
            const timer = setTimeout(() => {
                sceneTimers.delete(timer);
                resolve(true);
            }, duration);

            sceneTimers.set(timer, resolve);
        });
    }

    function cancelSceneTimers() {
        sceneTimers.forEach((resolve, timer) => {
            clearTimeout(timer);
            resolve(false);
        });

        sceneTimers.clear();
    }

    function cancelTextAnimations() {
        textAnimations.forEach((animation) => animation.cancel());
        textAnimations = [];
    }

    function clearSpecialSequences() {
        cancelSceneTimers();
        cancelTextAnimations();

        escapeCleanup?.();
        escapeCleanup = null;

        stopAudio(doorSlamSound);
        stopAudio(ravenCalmingVoice);

        endingAnimations.forEach((animation) => animation.cancel());
        endingAnimations = [];

        endingImageAnimation?.cancel();
        endingImageAnimation = null;

        cancelAnimationFrame(endingAudioFrame);
        endingAudioFrame = null;

        stopAudio(endingCorridorVideo);
        endingCorridorVideo.hidden = true;

        endingImage.hidden = true;
        endingTitle.hidden = true;
        endingLayer.hidden = true;

        endingCaption.textContent = "";
        endingBlackout.style.opacity = "0";
        endingFlash.style.opacity = "0";

        heartbeatSound.volume = 0.3;
    }

    function stopKnocking() {
        stopAudio(knockSound);
    }

    function stopMovementSounds() {
        clearTimeout(movementTimer);
        movementTimer = null;

        isRunningUpstairs = false;

        movementSounds.forEach(stopAudio);
        footstepsSound.loop = false;
    }

    function startStairFootsteps(upstairs = false) {
        const sound = upstairs
            ? upstairsFootstepsSound
            : footstepsSound;

        sound.loop = true;
        playAudio(sound);

        clearTimeout(movementTimer);

        movementTimer = setTimeout(() => {
            stopAudio(sound);

            if (!upstairs) sound.loop = false;

            movementTimer = null;
        }, STAIR_FOOTSTEP_DURATION);
    }

    function hideWestVideo() {
        if (!westVideo) return;

        stopAudio(westVideo);
        westVideo.hidden = true;
    }

    function stopIntroMusic() {
        cancelAnimationFrame(introFadeFrame);
        introFadeFrame = null;

        stopAudio(introMusic);

        if (introMusic) introMusic.volume = INTRO_VOLUME;
    }

    function stopSceneMusic() {
        cancelAnimationFrame(sceneMusicFrame);
        sceneMusicFrame = null;
        activeSceneMusic = null;

        sceneMusicTracks.forEach((track) => {
            stopAudio(track);
            track.volume = 0;
        });
    }

    function switchSceneMusic(nextTrack, targetVolume, duration = 2000) {
        if (!nextTrack) {
            stopSceneMusic();
            return;
        }

        if (activeSceneMusic === nextTrack && !nextTrack.paused) {
            return;
        }

        cancelAnimationFrame(sceneMusicFrame);

        const fadingTracks = sceneMusicTracks
            .filter((track) => track !== nextTrack)
            .map((track) => ({
                track,
                volume: track.volume
            }));

        if (nextTrack.paused) nextTrack.volume = 0;

        const startingVolume = nextTrack.volume;

        activeSceneMusic = nextTrack;
        playAudio(nextTrack);

        let startedAt = null;

        function fade(timestamp) {
            if (startedAt === null) startedAt = timestamp;

            const progress = clamp(
                (timestamp - startedAt) / duration
            );

            nextTrack.volume = clamp(
                startingVolume +
                (targetVolume - startingVolume) * progress
            );

            fadingTracks.forEach(({ track, volume }) => {
                track.volume = clamp(volume * (1 - progress));
            });

            if (progress < 1) {
                sceneMusicFrame = requestAnimationFrame(fade);
            } else {
                fadingTracks.forEach(({ track }) => {
                    stopAudio(track);
                    track.volume = 0;
                });

                sceneMusicFrame = null;
            }
        }

        sceneMusicFrame = requestAnimationFrame(fade);
    }

    function updateSceneAudio(scene) {
        if (scene.peekingVisible) {
    breathingSound.volume = 0.35;

    if (breathingSound.paused) {
        playAudio(breathingSound);
    }
} else {
    stopAudio(breathingSound);
}

if (scene.peekingVisible) {
    heartbeatSound.volume = 0.12;
}
        if (scene.westVisible || scene.bootsVisible) {
            if (westAmbience?.paused) playAudio(westAmbience);
        } else {
            stopAudio(westAmbience);
        }

        if (scene.scrubVisible) {
            if (scrubbingSound?.paused) playAudio(scrubbingSound);
        } else {
            stopAudio(scrubbingSound);
        }

        if (scene.figureEncounter && figureMusic) {
            switchSceneMusic(figureMusic, 0.5, 1800);
        } else if (
            scene.upstairsVisible ||
            scene.doorVisible ||
            scene.suspense
        ) {
            switchSceneMusic(stairsMusic, 0.5, 1800);
        } else if (scene.outside) {
            switchSceneMusic(outdoorMusic, 0.65, 2200);
        } else {
            stopSceneMusic();
        }

        if (scene.heartbeat) {
            if (heartbeatSound.paused) playAudio(heartbeatSound);
        } else {
            stopAudio(heartbeatSound);
        }
    }

    function stopAllSounds(preserveKnocking = false) {
        clearSpecialSequences();
        if (!preserveKnocking) stopKnocking();
        stopMovementSounds();
        stopIntroMusic();
        stopSceneMusic();

       [
    trashWhooshSound,
    westAmbience,
    scrubbingSound,
    heartbeatSound,
    breathingSound,
    doorSlamSound
].forEach(stopAudio);

        sceneVideos.forEach((video) => {
            stopAudio(video);
            video.hidden = true;
        });

        emptyLotImage.hidden = true;
        peekingImage.hidden = true;

        hideWestVideo();
    }

    function clearObjective() {
        clearTimeout(objectiveTimer);
        objectiveTimer = null;

        if (!objectiveBubble) return;

        objectiveBubble.hidden = true;
        objectiveBubble.classList.remove("objective-active");
    }

    async function prepareObjectiveAudio() {
        try {
            const Context =
                window.AudioContext || window.webkitAudioContext;

            if (!Context) return;

            if (!objectiveAudioContext) {
                objectiveAudioContext = new Context();
            }

            if (objectiveAudioContext.state === "suspended") {
                await objectiveAudioContext.resume();
            }
        } catch (error) {
            console.warn("UI sounds unavailable:", error.message);
        }
    }

    function createTone(frequency, endFrequency, delay, volume) {
        const context = objectiveAudioContext;

        if (!context || context.state !== "running") return;

        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + delay;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(
            endFrequency,
            start + 0.22
        );

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(start);
        oscillator.stop(start + 0.32);

        oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
        };
    }

    function updateObjective(scene) {
        clearObjective();

        const nextObjective = scene.objective || "";

        if (
            objectiveBubble &&
            nextObjective &&
            nextObjective !== previousObjective
        ) {
            // Your CSS already adds the NEW OBJECTIVE heading.
            objectiveBubble.textContent = nextObjective;
            objectiveBubble.hidden = false;

            void objectiveBubble.offsetWidth;

            objectiveBubble.classList.add("objective-active");

            createTone(440, 440, 0, 0.08);
            createTone(660, 660, 0.15, 0.08);

            const revision = sceneRevision;

            objectiveTimer = setTimeout(() => {
                if (sceneIsCurrent(revision)) clearObjective();
            }, OBJECTIVE_DURATION);
        }

        previousObjective = nextObjective;
    }

    function refreshInventory(scene) {
        const contents = scene.inventory || "Empty";

        if (inventory) {
            inventory.textContent = `Inventory: ${contents}`;
            inventory.hidden = contents === "Empty";
        }

        inventoryIcons.replaceChildren();

        const items = [];

        if (/gloves/i.test(contents)) {
            items.push(["🧤", "Gloves"]);
        }

        if (/cleaning supplies/i.test(contents)) {
            items.push(["🧴", "Cleaning supplies"]);
        }

        if (/trash bag/i.test(contents)) {
            items.push(["🗑️", "Trash bag"]);
        }

        items.forEach(([icon, name]) => {
            const item = document.createElement("span");

            item.textContent = icon;
            item.title = name;
            item.setAttribute("role", "listitem");
            item.setAttribute("aria-label", name);

            inventoryIcons.appendChild(item);
        });

        inventoryIcons.hidden = items.length === 0;
        backButton.disabled = currentScene === 0;
    }

    function fitSuppliesOutline() {
        const svg = suppliesHighlight.querySelector("svg");
        if (!svg) return;

        const width = gameScreen.clientWidth;
        const height = gameScreen.clientHeight;

        if (!width || !height) return;

        const scale = Math.max(width / 1672, height / 941);
        const imageWidth = 1672 * scale;
        const imageHeight = 941 * scale;

        svg.style.width = `${imageWidth}px`;
        svg.style.height = `${imageHeight}px`;
        svg.style.left = `${(width - imageWidth) * 0.65}px`;
        svg.style.top = `${(height - imageHeight) * 0.5}px`;
    }

    if ("ResizeObserver" in window) {
        new ResizeObserver(fitSuppliesOutline).observe(gameScreen);
    } else {
        window.addEventListener("resize", fitSuppliesOutline);
    }

    function fadeInText(scene) {
        cancelTextAnimations();

        if (reducedMotion || scene.instantText) return;

        [sceneLabel, sceneTitle, storyText]
            .filter((element) => element && !element.hidden)
            .forEach((element, index) => {
                if (
                    element === storyText &&
                    (
                        scene.dumpsterApproachVisible ||
                        scene.dumpsterVisible
                    )
                ) {
                    return;
                }

                const animation = element.animate(
                    [
                        {
                            opacity: 0,
                            transform: "translateY(10px)"
                        },
                        {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    ],
                    {
                        duration: 1200,
                        delay: index * 180,
                        easing: "ease-out",
                        fill: "backwards"
                    }
                );

                textAnimations.push(animation);
            });
    }

    async function scheduleAutomaticScene(scene) {
        const revision = sceneRevision;

        if (!await sceneWait(scene.automaticDuration)) return;
        if (!sceneIsCurrent(revision)) return;

        if (scene.fadeBeforeNext && !reducedMotion) {
            const animation = storyText.animate(
                [
                    { opacity: 1, transform: "translateY(0)" },
                    { opacity: 0, transform: "translateY(-6px)" }
                ],
                {
                    duration: 800,
                    easing: "ease-in",
                    fill: "forwards"
                }
            );

            textAnimations.push(animation);

            try {
                await animation.finished;
            } catch {
                return;
            }
        }

        if (!sceneIsCurrent(revision)) return;

        currentScene += 1;
        showScene();
    }

    function updateSceneVideo(video, visible, restart = false) {
        if (!visible) {
            stopAudio(video);
            video.hidden = true;
            return;
        }

        if (video.hidden || restart) {
            try {
                video.currentTime = 0;
            } catch {
                // The file may still be loading.
            }
        }

        video.hidden = false;
        playSilentVideo(video);
    }

    function startEscapeSequence() {
        const revision = sceneRevision;
        let finished = false;

        escapeVideo.hidden = false;
        escapeVideo.loop = false;

        actionButton.hidden = true;
        actionButton.disabled = true;

        backButton.focus({ preventScroll: true });

        try {
            escapeVideo.currentTime = 0;
        } catch {
            // Start at the beginning once loaded.
        }

        playAudio(doorOpenSound);
        playAudio(runningSound);

        function finishEscape() {
            playAudio(doorSlamSound);
            breathingSound.volume = 0.45;
heartbeatSound.volume = 0.16;
playAudio(breathingSound);
            if (finished || !sceneIsCurrent(revision)) return;

            finished = true;

            cancelSceneTimers();

            stopMovementSounds();
            stopSceneMusic();

            // Keep the final frame visible.
            escapeVideo.pause();
            escapeVideo.hidden = false;

            gameScreen.classList.remove("escape-black");

            stopAudio(doorSlamSound);
            playAudio(doorSlamSound);

            actionButton.textContent = "Peek through the blinds";
            actionButton.disabled = false;
            actionButton.hidden = false;

            actionButton.focus({ preventScroll: true });
        }

        function onError() {
            console.error(
                "Check videos/door_push_open_scared.mp4"
            );

            finishEscape();
        }

        escapeVideo.addEventListener("ended", finishEscape);
        escapeVideo.addEventListener("error", onError);

        escapeCleanup = () => {
            escapeVideo.removeEventListener("ended", finishEscape);
            escapeVideo.removeEventListener("error", onError);
        };

        const promise = playSilentVideo(escapeVideo);

        promise?.catch(finishEscape);

        sceneWait(15000).then((completed) => {
            if (completed) finishEscape();
        });
    }

    async function startPeekingSequence() {
        const revision = sceneRevision;

        actionButton.hidden = true;
        actionButton.disabled = true;

        backButton.focus({ preventScroll: true });

        if (!await sceneWait(7000)) return;
        if (!sceneIsCurrent(revision)) return;

        cancelTextAnimations();

        if (!reducedMotion) {
            const fadeOut = storyText.animate(
                [
                    { opacity: 1, transform: "translateY(0)" },
                    { opacity: 0, transform: "translateY(-6px)" }
                ],
                {
                    duration: 800,
                    easing: "ease-in",
                    fill: "forwards"
                }
            );

            textAnimations.push(fadeOut);

            try {
                await fadeOut.finished;
            } catch {
                return;
            }

            if (!sceneIsCurrent(revision)) return;

            cancelTextAnimations();
        }

        storyText.textContent = "It was gone.";

        if (!reducedMotion) {
            const fadeIn = storyText.animate(
                [
                    { opacity: 0, transform: "translateY(10px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                {
                    duration: 1400,
                    easing: "ease-out",
                    fill: "backwards"
                }
            );

            textAnimations.push(fadeIn);

            try {
                await fadeIn.finished;
            } catch {
                return;
            }
        }

        if (!sceneIsCurrent(revision)) return;

        actionButton.textContent = "Go to bed";
        actionButton.disabled = false;
        actionButton.hidden = false;

        actionButton.focus({ preventScroll: true });
    }

    function animateEnding(element, keyframes, options) {
        const animation = element.animate(keyframes, options);

        endingAnimations.push(animation);

        return animation.finished
            .then(() => true)
            .catch(() => false);
    }

    function hideEndingMedia() {
        endingImage.hidden = true;

        stopAudio(endingCorridorVideo);
        endingCorridorVideo.hidden = true;

        endingImageAnimation?.cancel();
        endingImageAnimation = null;
    }

    function showEndingImage(source, duration, zoom = 1.04) {
        hideEndingMedia();

        endingImage.src = source;
        endingImage.hidden = false;

        if (!reducedMotion) {
            endingImageAnimation = endingImage.animate(
                [
                    { transform: "scale(1)" },
                    { transform: `scale(${zoom})` }
                ],
                {
                    duration,
                    easing: "ease-out",
                    fill: "forwards"
                }
            );
        }
    }

    function flashEnding() {
        if (reducedMotion) return;

        animateEnding(
            endingFlash,
            [
                { opacity: 0 },
                { opacity: 0.35 },
                { opacity: 0 }
            ],
            {
                duration: 180,
                easing: "ease-out",
                fill: "backwards"
            }
        );
    }

    function setEndingCaption(text, fade = true) {
        endingCaption.textContent = text;

        if (!fade || reducedMotion) return;

        animateEnding(
            endingCaption,
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            {
                duration: 850,
                easing: "ease-out",
                fill: "backwards"
            }
        );
    }

    function fadeEndingAudio(duration = 1800) {
        cancelAnimationFrame(sceneMusicFrame);
        sceneMusicFrame = null;

        const tracks = [...sceneMusicTracks, heartbeatSound];
        const volumes = tracks.map((track) => track.volume);

        let startedAt = null;

        function fade(timestamp) {
            if (startedAt === null) startedAt = timestamp;

            const progress = clamp(
                (timestamp - startedAt) / duration
            );

            tracks.forEach((track, index) => {
                track.volume = clamp(
                    volumes[index] * (1 - progress)
                );
            });

            if (progress < 1) {
                endingAudioFrame = requestAnimationFrame(fade);
            } else {
                endingAudioFrame = null;

                stopSceneMusic();
                stopAudio(heartbeatSound);

                heartbeatSound.volume = 0.3;
            }
        }

        endingAudioFrame = requestAnimationFrame(fade);
    }

    async function startEndingMontage() {
        stopAudio(breathingSound);
        heartbeatSound.volume = 0.14;

        const revision = sceneRevision;

        async function wait(duration) {
            return (
                await sceneWait(duration)
            ) && sceneIsCurrent(revision);
        }

        endingLayer.hidden = false;

        actionButton.hidden = true;
        actionButton.disabled = true;

        storyText.hidden = true;

        if (sceneLabel) sceneLabel.hidden = true;
        if (sceneTitle) sceneTitle.hidden = true;
        if (inventory) inventory.hidden = true;
        if (listenButton) listenButton.hidden = true;

        inventoryIcons.hidden = true;

        clearObjective();
        stopMovementSounds();
        stopSceneMusic();

        backButton.focus({ preventScroll: true });

        // Upstairs.
        flashEnding();

        showEndingImage(endingAssets.stairs, 4200, 1.04);

        setEndingCaption(
            "Relieved, I headed up to my bedroom without looking back"
        );

        playAudio(upstairsFootstepsSound);

        if (!await wait(4200)) return;

        stopAudio(upstairsFootstepsSound);

        // Bed.
        showEndingImage(endingAssets.bed, 3200, 1.025);
        setEndingCaption("and crawled into bed.");
        playAudio(ravenCalmingVoice);

        heartbeatSound.volume = 0.2;

        if (!await wait(3200)) return;

        // Ceiling — a longer, slow zoom.
        showEndingImage(endingAssets.ceiling, 11500, 1.12);

        setEndingCaption(
            "I stared at the ceiling, waiting to calm down."
        );

        heartbeatSound.volume = 0.14;

        if (!await wait(9000)) return;

        // The fractures begin after Raven's voice has finished.
        stopAudio(ravenCalmingVoice);
        stopAudio(breathingSound);
        setEndingCaption("Then the fractures began.");
        switchSceneMusic(stairsMusic, 0.4, 1400);

        if (!await wait(2500)) return;

        // Punch bowl.
        flashEnding();

        showEndingImage(endingAssets.punch, 1800, 1.035);

        setEndingCaption(
            "A red punch bowl on a long white table.",
            false
        );

        if (!await wait(1800)) return;

        // Ellie now uses your still image.
        showEndingImage(endingAssets.ellie, 1400, 1.04);
        setEndingCaption("Ellie laughing.", false);

        if (!await wait(1400)) return;

        // Keep the corridor and figure visible during the narration.
hideEndingMedia();

endingCorridorVideo.hidden = false;
endingCorridorVideo.loop = true;
endingCorridorVideo.style.filter = "brightness(1)";

try {
    endingCorridorVideo.currentTime = 0;
} catch {
    // The clip may still be loading.
}

playSilentVideo(endingCorridorVideo);

setEndingCaption("Flickering hallway lights.");

if (!await wait(4000)) return;

setEndingCaption(
    "And for a split second, at the far end of a corridor, that same shadowed figure stood motionless."
);

if (!await wait(6500)) return;

setEndingCaption("Watching.");

if (!await wait(3000)) return;
        // Fade to the final black screen.
        fadeEndingAudio(1800);

        if (reducedMotion) {
            endingBlackout.style.opacity = "1";
        } else {
            const completed = await animateEnding(
                endingBlackout,
                [
                    { opacity: 0 },
                    { opacity: 1 }
                ],
                {
                    duration: 1800,
                    easing: "ease-in-out",
                    fill: "forwards"
                }
            );

            if (!completed || !sceneIsCurrent(revision)) return;
        }

        endingCaption.textContent = "";

        if (!await wait(600)) return;

        // To be continued.
        endingTitle.hidden = false;

        if (!reducedMotion) {
            const completed = await animateEnding(
                endingTitle,
                [
                    { opacity: 0 },
                    { opacity: 1 }
                ],
                {
                    duration: 2200,
                    easing: "ease-out",
                    fill: "backwards"
                }
            );

            if (!completed || !sceneIsCurrent(revision)) return;
        }

        if (!sceneIsCurrent(revision)) return;

        actionButton.textContent = "Return to title";
        actionButton.disabled = false;
        actionButton.hidden = false;

        actionButton.focus({ preventScroll: true });
    }

    function showScene() {
        // Invalidate callbacks from the previous scene first.
        sceneRevision += 1;

        clearSpecialSequences();
        stopMovementSounds();
        stopAudio(trashWhooshSound);

        const scene = scenes[currentScene];
        if (!scene) return;

        gameScreen.classList.remove(...sceneClasses);

        void gameScreen.offsetWidth;

        Object.entries(sceneClassMap).forEach(([property, name]) => {
            gameScreen.classList.toggle(name, Boolean(scene[property]));
        });

        gameScreen.classList.toggle("door-scene", currentScene === 0);
        gameScreen.classList.toggle(
            "raven-speaking",
            scene.speaker === "Raven"
        );

        if (sceneLabel) {
            sceneLabel.textContent = scene.label || "";
            sceneLabel.hidden = !scene.label;
        }

        if (sceneTitle) {
            const heading = scene.speaker || scene.title || "";

            sceneTitle.textContent = heading;
            sceneTitle.hidden = !heading;
        }

        storyText.textContent = scene.text || "";
        storyText.hidden = !scene.text;

        actionButton.textContent = scene.action || "Continue";
        actionButton.disabled = false;
        actionButton.hidden = Boolean(
            scene.automaticDuration ||
            scene.escapeVisible ||
            scene.peekingVisible ||
            scene.endingMontage
        );

        if (listenButton) {
            listenButton.hidden = currentScene !== 0;
        }

        refreshInventory(scene);
        updateObjective(scene);
        updateSceneAudio(scene);

        suppliesHighlight.hidden = !scene.closetVisible;
        fitSuppliesOutline();

        if (westVideo) {
            if (scene.westVisible) {
                const wasHidden = westVideo.hidden;

                westVideo.hidden = false;
                westVideo.muted = true;
                westVideo.loop = true;

                if (wasHidden) {
                    try {
                        westVideo.currentTime = 0;
                    } catch {
                        // The video may still be loading.
                    }
                }

                if (scene.westTalking) {
                    playSilentVideo(westVideo);
                } else {
                    westVideo.pause();
                }
            } else {
                hideWestVideo();
            }
        }

        updateSceneVideo(stairsVideo, scene.upstairsVisible);
        updateSceneVideo(doorVideo, scene.doorVisible);
        updateSceneVideo(bulbVideo, scene.bulbVisible);

        updateSceneVideo(
            figureVideo,
            scene.parkingLotFigureVisible,
            scene.restartFigure
        );

        if (!scene.escapeVisible) {
            stopAudio(escapeVideo);
            escapeVideo.hidden = true;
        }

        emptyLotImage.hidden = !scene.darknessVisible;
        peekingImage.hidden = !scene.peekingVisible;

        if (scene.upstairsVisible) {
            startStairFootsteps(true);
        } else if (scene.stairsVisible) {
            startStairFootsteps(false);
        }

        fadeInText(scene);

        if (scene.escapeVisible) {
            startEscapeSequence();
        } else if (scene.peekingVisible) {
            startPeekingSequence();
        } else if (scene.endingMontage) {
            const revision = sceneRevision;

            startEndingMontage().catch((error) => {
                if (!sceneIsCurrent(revision)) return;

                console.error("Ending montage error:", error);

                clearSpecialSequences();
                stopMovementSounds();
                stopSceneMusic();
                stopAudio(heartbeatSound);

                storyText.textContent = "To be continued.";
                storyText.hidden = false;

                actionButton.textContent = "Return to title";
                actionButton.disabled = false;
                actionButton.hidden = false;
            });
        } else if (scene.automaticDuration) {
            scheduleAutomaticScene(scene);
            backButton.focus({ preventScroll: true });
        } else {
            actionButton.focus({ preventScroll: true });
        }
    }

    function clearIntro() {
        clearTimeout(introTimer);
        introTimer = null;

        introAnimation?.cancel();
        introAnimation = null;
        introRunning = false;
    }

    function clearEpisode() {
        clearTimeout(episodeTimer);
        episodeTimer = null;

        episodeAnimation?.cancel();
        episodeAnimation = null;
        episodeRunning = false;

        if (episodeScreen) episodeScreen.hidden = true;
    }

    function fadeOutIntroMusic(duration = 3500) {
        if (!introMusic) return;

        cancelAnimationFrame(introFadeFrame);

        const volume = introMusic.volume;
        let startedAt = null;

        function fade(timestamp) {
            if (startedAt === null) startedAt = timestamp;

            const progress = clamp(
                (timestamp - startedAt) / duration
            );

            introMusic.volume = clamp(volume * (1 - progress));

            if (progress < 1) {
                introFadeFrame = requestAnimationFrame(fade);
            } else {
                stopIntroMusic();
            }
        }

        introFadeFrame = requestAnimationFrame(fade);
    }
/* INTERACTIVE OPENING STAIRS */
function beginGame() {
    clearIntro();
    clearEpisode();
    clearObjective();
    stopAllSounds();

    titleScreen.hidden = true;
    gameScreen.hidden = true;

    if (introScreen) introScreen.hidden = true;
    if (episodeScreen) episodeScreen.hidden = true;

    const opening = get("stair-opening");
    const video = get("opening-stairs-video");
    const button = get("opening-stairs-button");
    const controls = get("opening-balance-controls");
    const meter = get("opening-balance-meter");
    const prompt = get("opening-balance-prompt");
    const image = get("opening-stairs-image");
    const story = get("opening-stairs-story");

    if (
        !opening || !video || !button || !controls ||
        !meter || !prompt || !image || !story
    ) {
        console.error("Opening stair elements are missing.");
        beginApartmentGame();
        return;
    }

    const openingFootsteps = makeAudio(
        "audio/freesound_community-footsteps-67216.mp3",
        0.35,
        true
    );

    const ellieVoice = makeAudio(
        "audio/ElevenLabs_2026-10-10T16_42_07_Isla Sterling - Engaging Audiobook Narrator_pvc_sp91_s29_sb56_v4.mp3",
        0.55,
        false
    );

    const listeners = new AbortController();
    const signal = listeners.signal;

    let phase = "waiting";
    let balance = 35;
    let firstTap = false;
    let lastTimestamp = null;
    let balanceFrame = null;
    let focusTimer = null;

    opening.hidden = false;
    opening.classList.remove("opening-black");

    image.src = "images/Amber Lantern Stairway at Night.jpg";
    image.hidden = false;
    image.style.transform = "scale(1)";
    image.style.transformOrigin = "center 45%";

    story.hidden = true;
    controls.hidden = true;
    button.hidden = true;
    button.disabled = false;
    button.textContent = "Go upstairs";

    video.pause();
    video.hidden = true;

    Object.assign(button.style, {
        background: "#8b1717",
        border: "1px solid #c74646",
        color: "#fff",
        padding: "14px 24px",
        cursor: "pointer"
    });

    let openingObjective = get("opening-stairs-objective");

    if (!openingObjective) {
        openingObjective = document.createElement("p");
        openingObjective.id = "opening-stairs-objective";
        openingObjective.setAttribute("role", "status");
        opening.appendChild(openingObjective);
    }

    openingObjective.hidden = true;
    openingObjective.textContent = "Go up to the second floor.";

    Object.assign(openingObjective.style, {
        position: "absolute",
        top: "24px",
        left: "24px",
        zIndex: "10",
        maxWidth: "calc(100% - 48px)",
        margin: "0",
        padding: "12px 16px",
        background: "rgba(12, 12, 12, 0.88)",
        borderLeft: "3px solid #c74646",
        color: "#ffe9a0",
        fontSize: "15px",
        textAlign: "left",
        pointerEvents: "none"
    });

    function wait(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    function reveal(element) {
        element.hidden = false;

        if (!reducedMotion) {
            element.animate(
                [
                    { opacity: 0, transform: "translateY(8px)" },
                    { opacity: 1, transform: "translateY(0)" }
                ],
                { duration: 600, easing: "ease-out" }
            );
        }
    }

    // Brief pause before showing the objective and button.
    setTimeout(() => {
        if (phase !== "waiting" || opening.hidden) return;

        phase = "approach-ready";
        reveal(openingObjective);
        reveal(button);
    }, 1000);

    async function approachStairs() {
        if (phase !== "approach-ready") return;

        phase = "approaching";
        button.hidden = true;
        button.disabled = true;

        playAudio(openingFootsteps);

        if (reducedMotion) {
            openingObjective.hidden = true;
            await wait(6000);
        } else {
            const objectiveFade = openingObjective.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                { duration: 500, fill: "forwards" }
            );

            objectiveFade.finished.then(() => {
                openingObjective.hidden = true;
                objectiveFade.cancel();
            }).catch(() => {});

            const approach = image.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(1.35)" }
                ],
                {
                    duration: 6000,
                    easing: "linear",
                    fill: "forwards"
                }
            );

            await approach.finished.catch(() => {});

            image.style.transform = "scale(1.35)";
            approach.cancel();
        }

        startBalance();
    }

    function startBalance() {
        phase = "balance";
        balance = 35;
        firstTap = false;
        lastTimestamp = null;

        openingObjective.hidden = true;

        image.src = "images/Ascending Into the Starry Night.jpg";
        image.style.transform = "scale(1)";

        story.hidden = false;
        story.textContent =
            "The stairwell blurred under my feet, each step folding into the next. My legs dragged behind me.";

        controls.hidden = false;
        meter.value = balance;

        prompt.textContent =
            "Tap SPACE repeatedly to regain your balance.";

        button.hidden = false;
        button.disabled = false;
        button.textContent = "Regain balance";

        video.hidden = false;
        video.muted = true;
        video.loop = true;
        video.playbackRate = 1;
        video.src = "videos/stairs_tilt.mp4";

        video.load();
        playOpeningVideo();

        balanceFrame = requestAnimationFrame(updateBalance);
        button.focus({ preventScroll: true });
    }

    function playOpeningVideo() {
        video.play().catch(error => {
            console.warn("Opening video could not play:", error);

            if (phase === "focus") {
                showClearStairs();
            } else {
                video.hidden = true;
            }
        });
    }

    function showClearStairs() {
        if (phase !== "focus") return;

        phase = "ready";

        stopAudio(openingFootsteps);
        clearTimeout(focusTimer);

        video.pause();
        video.hidden = true;

        button.disabled = false;
        button.textContent = "Continue";
        button.focus({ preventScroll: true });
    }

    function startFocusClip() {
        if (phase !== "balance") return;

        phase = "focus";
        cancelAnimationFrame(balanceFrame);

        controls.hidden = true;
        button.disabled = true;
        button.textContent = "Steadying…";

        stopMovementSounds();

        video.pause();
        video.hidden = false;
        video.loop = false;
        video.src =
            "videos/stairs_blur_focus_blur_focus (1).mp4";

        video.load();
        playOpeningVideo();

        focusTimer = setTimeout(showClearStairs, 12000);
    }

    function regainBalance() {
        if (phase !== "balance") return;

        firstTap = true;
        balance = Math.min(100, balance + 9);
        meter.value = balance;

        if (balance >= 100) {
            startFocusClip();
        }
    }

    function updateBalance(timestamp) {
        if (phase !== "balance") return;

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }

        const elapsed = Math.min(
            (timestamp - lastTimestamp) / 1000,
            0.05
        );

        lastTimestamp = timestamp;

        if (firstTap && !document.hidden) {
            balance = Math.max(0, balance - elapsed * 5);
            meter.value = balance;
        }

        balanceFrame = requestAnimationFrame(updateBalance);
    }

    async function showBlackScreenLine(text, holdTime) {
        story.textContent = text;
        story.hidden = false;

        if (reducedMotion) {
            await wait(holdTime + 1200);
            story.hidden = true;
            return;
        }

        const fadeIn = story.animate(
            [
                { opacity: 0, transform: "translateY(12px)" },
                { opacity: 1, transform: "translateY(0)" }
            ],
            {
                duration: 1200,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        await fadeIn.finished.catch(() => {});
        await wait(holdTime);

        const fadeOut = story.animate(
            [
                { opacity: 1, transform: "translateY(0)" },
                { opacity: 0, transform: "translateY(-5px)" }
            ],
            {
                duration: 900,
                easing: "ease-in",
                fill: "forwards"
            }
        );

        await fadeOut.finished.catch(() => {});

        story.hidden = true;
        fadeIn.cancel();
        fadeOut.cancel();
    }

    async function finishOpening() {
        if (phase !== "ready") return;

        phase = "black";

        if (introMusic) introMusic.volume = 0.08;

        cancelAnimationFrame(balanceFrame);
        clearTimeout(focusTimer);

        video.pause();

        button.disabled = true;
        button.hidden = true;
        controls.hidden = true;
        story.hidden = true;
        openingObjective.hidden = true;

        if (!image.hidden && !reducedMotion) {
            const fade = image.animate(
                [{ opacity: 1 }, { opacity: 0 }],
                {
                    duration: 1000,
                    easing: "ease-in-out",
                    fill: "forwards"
                }
            );

            await fade.finished.catch(() => {});
            image.hidden = true;
            fade.cancel();
        } else {
            image.hidden = true;
        }

        video.hidden = true;
        opening.classList.add("opening-black");

        openingFootsteps.volume = 0.2;
        playAudio(openingFootsteps);

        await showBlackScreenLine(
            "Ellie’s arm wrapped more firmly around me, steadying my steps.",
            4200
        );

        stopAudio(openingFootsteps);
        await wait(650);

        playAudio(ellieVoice);

        await showBlackScreenLine(
            "“Careful,” she murmured.",
            2600
        );

        stopAudio(ellieVoice);
        await wait(800);

        showDoorArrival();
    }

    let doorZoom = null;

async function showDoorArrival() {
    phase = "door-arrival";

    stopKnocking();
    stopAudio(openingFootsteps);
    stopAudio(ellieVoice);
    stopMovementSounds();

    video.pause();
    video.hidden = true;
    controls.hidden = true;
    openingObjective.hidden = true;

    button.hidden = true;
    button.disabled = true;
    story.hidden = true;

    image.src = "images/Moody Anime Apartment Doorway at Night.jpg";
    image.style.transform = "scale(1)";
    image.style.transformOrigin = "50% 45%";

    // Wait for the image before revealing the scene.
    try {
        await image.decode();
    } catch {
        console.warn("Check the doorway image filename and path.");
    }

    opening.classList.remove("opening-black");
    image.hidden = false;

    if (introMusic) {
        introMusic.volume = 0.08;
    }

    if (!reducedMotion) {
        doorZoom = image.animate(
            [
                { opacity: 0, transform: "scale(1)", offset: 0 },
                { opacity: 1, transform: "scale(1.01)", offset: 0.125 },
                { opacity: 1, transform: "scale(1.08)", offset: 1 }
            ],
            {
                duration: 8000,
                easing: "linear",
                fill: "forwards"
            }
        );
    }

    await wait(800);

    if (phase !== "door-arrival") return;

    await showBlackScreenLine(
        "We reached the door.",
        3500
    );

    if (phase !== "door-arrival") return;

    button.textContent = "Continue";
    button.disabled = false;
    reveal(button);
    button.focus({ preventScroll: true });
}

async function finishDoorArrival() {
    if (phase !== "door-arrival" && phase !== "keypad-retry") return;
    phase = "keypad-cutscene";
    button.hidden = true;
    button.disabled = true;
    story.hidden = true;
    controls.hidden = true;
    openingObjective.hidden = true;
    stopKnocking();
    stopMovementSounds();
    stopAudio(openingFootsteps);
    stopAudio(ellieVoice);
    doorZoom?.cancel();
    doorZoom = null;

    const keypadBeeps = makeAudio(
        "audio/freesound_community-beep-beep-43875.mp3", 0.4, false
    );
    function reportBeepError() {
        if (phase !== "keypad-cutscene") return;
        story.textContent = "Keypad audio could not load: audio/freesound_community-beep-beep-43875.mp3";
        story.hidden = false;
    }
    keypadBeeps.addEventListener("error", reportBeepError, { once: true });

    // Reuse the same video element as the working stair clips.
    video.pause();
    video.src = "videos/keypad_tapping.mp4";
    video.poster = "images/Moody Anime Apartment Doorway at Night.jpg";
    video.loop = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.playbackRate = 1;
    video.hidden = false;
    video.style.setProperty("display", "block", "important");
    video.style.opacity = "1";
    video.style.transform = "none";
    opening.classList.remove("opening-black");

    const played = await new Promise(resolve => {
        let done = false;
        let watchdog;
        function finish(success) {
            if (done) return;
            done = true;
            clearTimeout(watchdog);
            video.removeEventListener("ended", ended);
            video.removeEventListener("error", failed);
            resolve(success);
        }
        function ended() { finish(true); }
        function failed() { finish(false); }
        video.addEventListener("ended", ended);
        video.addEventListener("error", failed);
        watchdog = setTimeout(failed, 20000);
        video.load();

        // Both play calls happen directly within the Continue click.
        keypadBeeps.play().catch(error => {
            console.warn("Keypad beeps could not play:", error);
            reportBeepError();
        });
        video.play().catch(error => {
            console.warn("Keypad video could not play:", error);
            failed();
        });
    });

    stopAudio(keypadBeeps);
    keypadBeeps.removeEventListener("error", reportBeepError);
    video.pause();

    if (!played) {
        video.style.removeProperty("display");
        video.hidden = true;
        phase = "keypad-retry";
        story.textContent = "Keypad video could not load: videos/keypad_tapping.mp4";
        story.hidden = false;
        button.textContent = "Retry keypad scene";
        button.disabled = false;
        reveal(button);
        return;
    }

    story.hidden = true;
    image.hidden = true;
    opening.classList.add("opening-black");
    if (!reducedMotion) {
        const fade = video.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 700, easing: "ease-in-out", fill: "forwards" }
        );
        await fade.finished.catch(() => {});
        video.style.removeProperty("display");
        video.hidden = true;
        fade.cancel();
    } else {
        video.style.removeProperty("display");
        video.hidden = true;
    }
    phase = "entry-black";
    await wait(250);

    // Open the door only after the picture has faded to black.
    stopAudio(doorOpenSound);
    await new Promise(resolve => {
        let done = false;
        let watchdog;
        function finishSound() {
            if (done) return;
            done = true;
            clearTimeout(watchdog);
            doorOpenSound.removeEventListener("ended", finishSound);
            doorOpenSound.removeEventListener("error", finishSound);
            resolve();
        }
        doorOpenSound.addEventListener("ended", finishSound);
        doorOpenSound.addEventListener("error", finishSound);
        watchdog = setTimeout(finishSound, 10000);
        doorOpenSound.play().catch(error => {
            console.warn("Could not play door opening:", error);
            finishSound();
        });
    });
    stopAudio(doorOpenSound);
    await wait(600);
    button.textContent = "Continue";
    button.disabled = false;
    reveal(button);
    button.focus({ preventScroll: true });
}

async function finishEntry() {
    if (phase !== "entry-black") return;
    phase = "vomiting-cutscene";
    button.disabled = true;
    button.hidden = true;
    story.hidden = true;
    controls.hidden = true;
    openingObjective.hidden = true;
    stopKnocking();
    stopMovementSounds();
    stopAudio(openingFootsteps);
    stopAudio(ellieVoice);
    video.pause();
    video.hidden = true;
    video.style.removeProperty("display");

    // Continue the opening music quietly beneath the brief cutscene.
    if (introMusic) {
        introMusic.volume = 0.08;
        introMusic.play().catch(error => console.warn("Opening music:", error));
    }

    image.src = "images/Raven vomiting.jpg";
    image.style.filter = "none";
    image.style.transform = "none";
    image.style.opacity = "1";
    try { await image.decode(); }
    catch (error) { console.warn("Could not load Raven vomiting image:", error); }
    image.hidden = false;
    opening.classList.remove("opening-black");
    await wait(1000);

    if (!reducedMotion) {
        const dip = image.animate([
            { transform: "scale(1)", filter: "blur(0px)" },
            { transform: "scale(1.04) translateY(-1%) rotate(0.6deg)", filter: "blur(3px)", offset: 0.5 },
            { transform: "scale(1.08) translateY(-2%) rotate(-0.6deg)", filter: "blur(8px)" }
        ], { duration: 2000, easing: "ease-in-out", fill: "forwards" });
        await wait(2000);
        image.hidden = true;
        dip.cancel();
    } else {
        await wait(2000);
        image.hidden = true;
    }
    opening.classList.add("opening-black");

    const vomitingSound = makeAudio(
        "audio/freesound_community-woman-vomiting-into-toilet-19948.mp3",
        0.45,
        false
    );
    try {
        await vomitingSound.play();
        // Three seconds at normal volume, then a half-second fade.
        await wait(3000);
        for (let step = 1; step <= 10; step += 1) {
            vomitingSound.volume = 0.45 * (1 - step / 10);
            await wait(50);
        }
    } catch (error) {
        console.warn("Could not play vomiting sound:", error);
    } finally {
        stopAudio(vomitingSound);
    }
    await wait(900);
    phase = "vomiting-finished";
    button.textContent = "Continue";
    button.disabled = false;
    reveal(button);
    button.focus({ preventScroll: true });
}

let couchZoom = null;

async function finishVomitingScene() {
    if (phase !== "vomiting-finished") return;
    phase = "couch-entering";
    button.disabled = true;
    button.hidden = true;
    story.hidden = true;
    controls.hidden = true;
    openingObjective.hidden = true;
    stopKnocking();
    stopMovementSounds();
    image.src = "images/Cozy Candlelit Living Room.jpg";
    image.style.opacity = "1";
    image.style.filter = "none";
    image.style.transform = "none";
    image.style.transformOrigin = "55% 52%";
    try { await image.decode(); }
    catch (error) { console.warn("Could not load couch image:", error); }
    image.hidden = false;
    opening.classList.remove("opening-black");
    if (introMusic) {
        introMusic.volume = 0.08;
        introMusic.play().catch(error => console.warn("Opening music:", error));
    }
    if (!reducedMotion) {
        couchZoom = image.animate([
            { opacity: 0, transform: "scale(1)" },
            { opacity: 1, transform: "scale(1.01)", offset: 0.08 },
            { opacity: 1, transform: "scale(1.12)" }
        ], { duration: 12000, easing: "linear", fill: "forwards" });
    }
    await wait(800);
    story.textContent = "I collapsed into the cushions. I meant to thank her, to say her name, but all that surfaced was a fractured whisper.";
    story.hidden = false;
    story.style.opacity = "1";
    if (!reducedMotion) {
        const textEntrance = story.animate([
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
        ], { duration: 1200, easing: "ease-out" });
        await textEntrance.finished;
    }
    // Leave the words visible so players can finish reading at their pace.
    await wait(3500);
    phase = "couch-ready";
    button.textContent = "Continue";
    button.disabled = false;
    reveal(button);
    button.focus({ preventScroll: true });
}

async function playOpeningClip(media, timeout, stopAt = null) {
    return new Promise(resolve => {
        let done = false;
        let watchdog;
        function finish() {
            if (done) return;
            done = true;
            clearTimeout(watchdog);
            media.removeEventListener("ended", finish);
            media.removeEventListener("error", finish);
            media.removeEventListener("timeupdate", checkTime);
            resolve();
        }
        function checkTime() {
            if (stopAt !== null && media.currentTime >= stopAt) {
                media.pause();
                finish();
            }
        }
        media.addEventListener("ended", finish);
        media.addEventListener("error", finish);
        media.addEventListener("timeupdate", checkTime);
        watchdog = setTimeout(finish, timeout);
        media.play().catch(error => {
            console.warn("Could not play opening clip:", error);
            finish();
        });
    });
}

async function finishCouchScene() {
    if (phase !== "couch-ready") return;
    phase = "ellie-rest";
    // Start silently during the player's click so the later drone is unlocked.
    const ceilingDrone = makeAudio(
        "audio/dragon-studio-deep-haunting-drone-482880.mp3", 0, true
    );
    ceilingDrone.play().catch(error => console.warn("Ceiling drone:", error));
    button.disabled = true;
    button.hidden = true;
    story.textContent = "“Get some rest, okay?”";
    story.hidden = false;
    const restVoice = makeAudio(
        "audio/ElevenLabs_2026-10-10T21_15_27_Isla Sterling - Engaging Audiobook Narrator_pvc_sp91_s29_sb56_v4.mp3",
        0.55,
        false
    );
    await playOpeningClip(restVoice, 15000, 2.1);
    stopAudio(restVoice);
    await wait(200);
    story.hidden = true;
    couchZoom?.cancel();
    couchZoom = null;

    phase = "ceiling-cutscene";
    video.pause();
    video.src = "videos/blinking_pov_drunk_slow.mp4";
    video.removeAttribute("poster");
    video.loop = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.playbackRate = 1.65;
    video.style.transformOrigin = "50% 50%";
    video.style.transform = "none";
    video.style.opacity = "1";
    video.hidden = false;
    video.style.setProperty("display", "block", "important");
    video.load();
    stopAudio(introMusic);
    ceilingDrone.volume = 0.5;
    const ceilingPlayback = playOpeningClip(video, 35000);
    ceilingDrone.play().catch(error => console.warn("Ceiling drone:", error));
    const ceilingZoom = reducedMotion ? null : video.animate([
        { opacity: 0, transform: "scale(1)" },
        { opacity: 1, transform: "scale(1.01)", offset: 0.08 },
        { opacity: 1, transform: "scale(1.10)" }
    ], { duration: 10000, easing: "linear", fill: "forwards" });
    await wait(1000);
    image.hidden = true;
    story.textContent = "I fought to keep my eyes open. For a moment, it felt as though my body was lifting from the couch, weightless. The ceiling drifted closer—until the darkness swallowed everything whole.";
    story.hidden = false;
    if (!reducedMotion) {
        story.animate([
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
        ], { duration: 1200, easing: "ease-out" });
    }
    await ceilingPlayback;
    video.pause();
    video.hidden = true;
    video.style.removeProperty("display");
    ceilingZoom?.cancel();
    story.hidden = true;
    opening.classList.add("opening-black");

    // The knocking begins on black and continues throughout the clock scene.
    stopKnocking();
    knockSound.loop = true;
    playAudio(knockSound);
    for (let step = 1; step <= 10; step += 1) {
        ceilingDrone.volume = 0.5 * (1 - step / 10);
        await wait(70);
    }
    stopAudio(ceilingDrone);
    await wait(400);
    await showBlackScreenLine(
        "A relentless pounding at the door tore me from sleep.",
        3000
    );
    image.src = "images/5 am clock.jpg";
    image.style.transform = "none";
    image.style.filter = "none";
    image.style.opacity = "1";
    try { await image.decode(); }
    catch (error) { console.warn("Could not load 5 AM clock:", error); }
    image.hidden = false;
    opening.classList.remove("opening-black");
    if (!reducedMotion) {
        image.animate([{ opacity: 0 }, { opacity: 1 }],
            { duration: 1800, easing: "ease-in-out" });
    }
    await wait(1800);
    phase = "clock-ready";
    button.textContent = "Continue";
    button.disabled = false;
    reveal(button);
    button.focus({ preventScroll: true });
}

function openDoorFromClock() {
    if (phase !== "clock-ready") return;
    phase = "finished";
    button.disabled = true;
    listeners.abort();
    stopAudio(openingFootsteps);
    stopAudio(ellieVoice);
    stopMovementSounds();
    opening.hidden = true;
    beginApartmentGame(false, true);
}
    document.addEventListener("keydown", event => {
        if (opening.hidden || event.code !== "Space") return;

        if (phase === "balance" || phase === "focus") {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (!event.repeat && phase === "balance") {
                regainBalance();
            }
        }
    }, { capture: true, signal });

    button.addEventListener("click", () => {
    if (phase === "approach-ready") {
        approachStairs();
    } else if (phase === "balance") {
        regainBalance();
    } else if (phase === "ready") {
        finishOpening();
    } else if ((phase === "door-arrival" || phase === "keypad-retry") && !button.disabled) {
        finishDoorArrival();
    } else if (phase === "entry-black" && !button.disabled) {
        finishEntry();
    } else if (phase === "vomiting-finished" && !button.disabled) {
        finishVomitingScene();
    } else if (phase === "couch-ready" && !button.disabled) {
        finishCouchScene();
    } else if (phase === "clock-ready" && !button.disabled) {
        openDoorFromClock();
    }
}, { signal });

    video.addEventListener("ended", showClearStairs, { signal });

    video.addEventListener("error", () => {
        console.warn("Could not load stair video:", video.src);

        if (phase === "focus") {
            showClearStairs();
        } else {
            video.hidden = true;
        }
    }, { signal });

    if (introMusic) {
        introMusic.volume = 0.14;
        playAudio(introMusic);
    }
}
    function beginApartmentGame(openDoorImmediately = false, preserveKnocking = false) {
        sceneRevision += 1;

        clearIntro();
        clearEpisode();
        clearObjective();
        stopAllSounds(preserveKnocking);
        [
    trashWhooshSound,
    westAmbience,
    scrubbingSound,
    heartbeatSound,
    breathingSound,
    doorSlamSound
].forEach(stopAudio);

        currentScene = openDoorImmediately ? 1 : 0;
        previousObjective = "";

        titleScreen.hidden = true;
        if (introScreen) introScreen.hidden = true;

        gameScreen.hidden = false;

        showScene();

        knockSound.loop = preserveKnocking;
        if (openDoorImmediately) {
            playAudio(doorOpenSound);
        } else {
            if (!preserveKnocking) playAudio(knockSound);
            footstepsSound.loop = false;
            playAudio(footstepsSound);
        }
    }

    function showEpisode() {
        if (episodeRunning) return;

        clearIntro();

        if (introScreen) introScreen.hidden = true;

        if (!episodeScreen) {
            beginGame();
            return;
        }

        clearEpisode();
        episodeRunning = true;

        titleScreen.hidden = true;
        gameScreen.hidden = true;

        episodeScreen.hidden = false;
        episodeScreen.tabIndex = -1;
        episodeScreen.focus({ preventScroll: true });

        if (!reducedMotion) {
            episodeAnimation = episodeScreen.animate(
                [
                    { opacity: 0, offset: 0 },
                    { opacity: 1, offset: 0.25 },
                    { opacity: 1, offset: 0.8 },
                    { opacity: 0, offset: 1 }
                ],
                {
                    duration: EPISODE_DURATION,
                    easing: "linear",
                    fill: "both"
                }
            );
        }

        fadeOutIntroMusic();

        episodeTimer = setTimeout(beginGame, EPISODE_DURATION);
    }

    function showIntroParagraph(index) {
        if (!introRunning || !introScreen) return;

        const paragraphs = [
            ...introScreen.querySelectorAll(".intro-text p")
        ];

        if (index >= paragraphs.length) {
            showEpisode();
            return;
        }

        paragraphs.forEach((paragraph) => {
            paragraph.hidden = true;
        });

        const paragraph = paragraphs[index];
        paragraph.hidden = false;

        const words = paragraph.textContent.trim().split(/\s+/).length;
        const duration = Math.max(4000, words * 350 + 1800);

        if (!reducedMotion) {
            introAnimation = paragraph.animate(
                [
                    {
                        opacity: 0,
                        transform: "translateY(12px)",
                        offset: 0
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)",
                        offset: 0.2
                    },
                    {
                        opacity: 1,
                        transform: "translateY(0)",
                        offset: 0.8
                    },
                    {
                        opacity: 0,
                        transform: "translateY(-6px)",
                        offset: 1
                    }
                ],
                {
                    duration,
                    easing: "linear",
                    fill: "both"
                }
            );
        }

        introTimer = setTimeout(() => {
            introAnimation?.cancel();
            introAnimation = null;

            paragraph.hidden = true;
            showIntroParagraph(index + 1);
        }, duration);
    }

    function startIntro() {
        sceneRevision += 1;

        clearIntro();
        clearEpisode();
        clearObjective();
        stopAllSounds();

        previousObjective = "";

        prepareObjectiveAudio();

        titleScreen.hidden = true;
        gameScreen.hidden = true;

        if (introMusic) {
            introMusic.volume = INTRO_VOLUME;
            playAudio(introMusic);
        }

        if (!introScreen) {
            showEpisode();
            return;
        }

        introScreen.hidden = false;
        introRunning = true;

        showIntroParagraph(0);

        skipIntroButton?.focus({ preventScroll: true });
    }

    function returnToTitle() {
        sceneRevision += 1;

        clearIntro();
        clearEpisode();
        clearObjective();
        stopAllSounds();

        currentScene = 0;
        previousObjective = "";

        gameScreen.hidden = true;
        gameScreen.classList.remove(...sceneClasses);

        suppliesHighlight.hidden = true;

        if (introScreen) introScreen.hidden = true;

        titleScreen.hidden = false;
        startButton.focus({ preventScroll: true });
    }

    function runUpstairs() {
        stopMovementSounds();

        isRunningUpstairs = true;

        actionButton.disabled = true;
        actionButton.textContent = "Running…";

        playAudio(runningSound);

        const revision = sceneRevision;

        movementTimer = setTimeout(() => {
            stopAudio(runningSound);

            movementTimer = null;
            isRunningUpstairs = false;

            if (!sceneIsCurrent(revision)) return;

            currentScene += 1;
            showScene();
        }, RUN_DURATION);
    }

    startButton.onclick = startIntro;

    if (skipIntroButton) {
        skipIntroButton.onclick = () => {
            if (introRunning) showEpisode();
        };
    }

    actionButton.onclick = function (event) {
        event.preventDefault();

        if (
            actionButton.hidden ||
            actionButton.disabled ||
            isRunningUpstairs
        ) {
            return;
        }

        const scene = scenes[currentScene];

        if (!scene || scene.automaticDuration) return;

        if (scene.upstairsVisible) {
            runUpstairs();
            return;
        }

        if (currentScene === scenes.length - 1) {
            returnToTitle();
            return;
        }

        const openingDoor = currentScene === 0;
        const throwingTrash = Boolean(scene.throwsTrash);

        stopKnocking();
        stopMovementSounds();
        stopAudio(trashWhooshSound);

        currentScene += 1;
        showScene();

        if (openingDoor) playAudio(doorOpenSound);

        if (scenes[currentScene].closesDoor) {
            playAudio(doorCloseSound);
        }

        if (throwingTrash) playAudio(trashWhooshSound);
    };

    backButton.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (currentScene <= 0) return;

        stopKnocking();
        stopMovementSounds();
        stopAudio(trashWhooshSound);

        currentScene -= 1;
        showScene();

        if (currentScene === 0) {
            playAudio(knockSound);

            footstepsSound.loop = false;
            playAudio(footstepsSound);
        } else {
            backButton.focus({ preventScroll: true });
        }
    };

    if (listenButton) {
        listenButton.onclick = function (event) {
            event.preventDefault();

            if (currentScene !== 0) return;

            stopMovementSounds();
            stopKnocking();

            playAudio(knockSound);

            storyText.textContent =
                "I hold my breath and listen. The pounding starts again. Whoever is outside still hasn’t said a word.";

            storyText.hidden = false;
            listenButton.hidden = true;

            fadeInText(scenes[currentScene]);
            actionButton.focus({ preventScroll: true });
        };
    }

    if (helpButton && helpText) {
        helpButton.onclick = () => {
            const expanded = !helpText.hidden;

            helpText.hidden = expanded;

            helpButton.setAttribute(
                "aria-expanded",
                String(!expanded)
            );
        };
    }

    gameScreen.addEventListener(
        "click",
        (event) => {
            const button = event.target.closest("button");

            if (button && !button.disabled && !button.hidden) {
                createTone(220, 90, 0, 0.045);
            }
        },
        true
    );

    titleScreen.hidden = false;
    gameScreen.hidden = true;

    if (introScreen) introScreen.hidden = true;
    if (episodeScreen) episodeScreen.hidden = true;

    inventoryIcons.hidden = true;
    suppliesHighlight.hidden = true;

    hideWestVideo();
    clearObjective();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeGame,
        { once: true }
    );
} else {
    initializeGame();
}
/* MAIN MENU HOVER SOUND */
(() => {
    function setupMenuHoverSound() {
        const buttons = document.querySelectorAll(
            "#title-screen .game-menu button"
        );

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!buttons.length || !AudioContextClass) return;

        let menuAudioContext = null;
        let lastToneTime = -Infinity;

        function getMenuAudioContext() {
            if (!menuAudioContext) {
                menuAudioContext = new AudioContextClass();
            }

            return menuAudioContext;
        }

        // Browsers require a click or keypress to enable audio.
        function unlockMenuAudio() {
            try {
                const context = getMenuAudioContext();

                if (context.state === "suspended") {
                    context.resume().catch(() => {});
                }
            } catch (error) {
                console.warn("Menu audio could not start:", error);
            }
        }

        function playMenuHoverTone() {
            if (
                !menuAudioContext ||
                menuAudioContext.state !== "running"
            ) {
                return;
            }

            const context = menuAudioContext;
            const now = context.currentTime;

            // Prevent overlapping tones from rapid mouse movement.
            if (now - lastToneTime < 0.12) return;
            lastToneTime = now;

            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = "sine";

            oscillator.frequency.setValueAtTime(220, now);
            oscillator.frequency.exponentialRampToValueAtTime(
                130,
                now + 0.16
            );

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.055, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                now + 0.18
            );

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.onended = () => {
                oscillator.disconnect();
                gain.disconnect();
            };

            oscillator.start(now);
            oscillator.stop(now + 0.2);
        }

        document.addEventListener(
            "pointerdown",
            unlockMenuAudio,
            { capture: true }
        );

        document.addEventListener(
            "keydown",
            unlockMenuAudio,
            { capture: true }
        );

        buttons.forEach((button) => {
            button.addEventListener("mouseenter", () => {
                if (!button.disabled) playMenuHoverTone();
            });

            button.addEventListener("focus", () => {
                if (!button.disabled) playMenuHoverTone();
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupMenuHoverSound,
            { once: true }
        );
    } else {
        setupMenuHoverSound();
    }
})();
/* MAIN MENU BACKGROUND VIDEO */
(() => {
    function setupMenuVideo() {
        const titleScreen = document.getElementById("title-screen");
        const menuVideo = document.getElementById(
            "menu-background-video"
        );

        if (!titleScreen || !menuVideo) return;

        menuVideo.muted = true;
        menuVideo.loop = true;
        menuVideo.playsInline = true;

        function updateMenuVideo() {
            const menuVisible =
                !titleScreen.hidden &&
                !document.hidden &&
                getComputedStyle(titleScreen).display !== "none";

            if (menuVisible) {
                menuVideo.play().catch(() => {
                    // Retry after the player's next interaction.
                });
            } else {
                menuVideo.pause();
            }
        }

        const menuObserver = new MutationObserver(updateMenuVideo);

        menuObserver.observe(titleScreen, {
            attributes: true,
            attributeFilter: ["hidden", "class", "style"]
        });

        document.addEventListener(
            "visibilitychange",
            updateMenuVideo
        );

        document.addEventListener("pointerdown", updateMenuVideo);
        document.addEventListener("keydown", updateMenuVideo);

        updateMenuVideo();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupMenuVideo,
            { once: true }
        );
    } else {
        setupMenuVideo();
    }
})();
/* RANDOM MAIN MENU GLITCH — FIXED */
(() => {
    function setupMenuGlitch() {
        const menu = document.getElementById("title-screen");
        if (!menu) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let glitchTimer = null;
        let resetTimer = null;

        function canGlitch() {
            return (
                !menu.hidden &&
                !document.hidden &&
                getComputedStyle(menu).display !== "none" &&
                !reducedMotion.matches
            );
        }

        function stopGlitches() {
            clearTimeout(glitchTimer);
            clearTimeout(resetTimer);

            glitchTimer = null;
            resetTimer = null;

            // Only change the class when necessary.
            if (menu.classList.contains("menu-glitch")) {
                menu.classList.remove("menu-glitch");
            }
        }

        function scheduleGlitch() {
            if (
                !canGlitch() ||
                glitchTimer !== null ||
                resetTimer !== null
            ) {
                return;
            }

            const delay = 5000 + Math.random() * 7000;

            glitchTimer = setTimeout(() => {
                glitchTimer = null;

                if (!canGlitch()) return;

                menu.classList.add("menu-glitch");

                resetTimer = setTimeout(() => {
                    resetTimer = null;
                    menu.classList.remove("menu-glitch");

                    scheduleGlitch();
                }, 240);
            }, delay);
        }

        function updateGlitches() {
            if (canGlitch()) {
                scheduleGlitch();
            } else {
                stopGlitches();
            }
        }

        const observer = new MutationObserver(updateGlitches);

        // Do not watch the class changed by the glitch itself.
        observer.observe(menu, {
            attributes: true,
            attributeFilter: ["hidden", "style"]
        });

        document.addEventListener(
            "visibilitychange",
            updateGlitches
        );

        reducedMotion.addEventListener(
            "change",
            updateGlitches
        );

        updateGlitches();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupMenuGlitch,
            { once: true }
        );
    } else {
        setupMenuGlitch();
    }
})();
/* MAIN MENU STATIC AND AMBIENCE */
(() => {
    function setupMenuAudio() {
        const menu = document.getElementById("title-screen");
        if (!menu) return;

        const staticSound = new Audio(
            "audio/freesound_community-radio-static-6382.mp3"
        );

        const menuMusic = new Audio(
            "audio/lachm-sound-ambience-sonido-ambiente-3-14040.mp3"
        );

        const tracks = [
            { audio: staticSound, volume: 0.07 },
            { audio: menuMusic, volume: 0.18 }
        ];

        tracks.forEach(({ audio }) => {
            audio.loop = true;
            audio.preload = "auto";
            audio.volume = 0;
        });

        let unlocked = false;
        let active = false;
        let fadeFrame = null;
        let revision = 0;

        function menuIsVisible() {
            return (
                !menu.hidden &&
                !document.hidden &&
                getComputedStyle(menu).display !== "none"
            );
        }

        function fadeTracks(playing) {
            cancelAnimationFrame(fadeFrame);

            const thisRevision = ++revision;
            const initialVolumes = tracks.map(
                ({ audio }) => audio.volume
            );

            if (playing) {
                tracks.forEach(({ audio }) => {
                    audio.play()
                        .then(() => {
                            // Stop playback if the menu closed
                            // while the file was loading.
                            if (
                                thisRevision !== revision &&
                                !active
                            ) {
                                audio.pause();
                            }
                        })
                        .catch((error) => {
                            if (
                                thisRevision === revision &&
                                active
                            ) {
                                active = false;
                            }

                            console.warn(
                                "Menu audio could not play:",
                                audio.src,
                                error
                            );
                        });
                });
            }

            const duration = playing ? 1200 : 600;
            let startedAt = null;

            function fade(timestamp) {
                if (thisRevision !== revision) return;

                if (startedAt === null) startedAt = timestamp;

                const progress = Math.min(
                    (timestamp - startedAt) / duration,
                    1
                );

                tracks.forEach(({ audio, volume }, index) => {
                    const target = playing ? volume : 0;

                    audio.volume = Math.max(
                        0,
                        Math.min(
                            1,
                            initialVolumes[index] +
                                (target - initialVolumes[index]) *
                                progress
                        )
                    );
                });

                if (progress < 1) {
                    fadeFrame = requestAnimationFrame(fade);
                } else {
                    fadeFrame = null;

                    if (!playing) {
                        tracks.forEach(({ audio }) => {
                            audio.pause();
                            audio.currentTime = 0;
                        });
                    }
                }
            }

            fadeFrame = requestAnimationFrame(fade);
        }

        function updateMenuAudio() {
            const shouldPlay = unlocked && menuIsVisible();

            if (shouldPlay === active) return;

            active = shouldPlay;
            fadeTracks(shouldPlay);
        }

        function unlockMenuAudio() {
            unlocked = true;
            updateMenuAudio();
        }

        // A click or keypress allows browser audio playback.
        document.addEventListener(
            "pointerdown",
            unlockMenuAudio
        );

        document.addEventListener(
            "keydown",
            unlockMenuAudio
        );

        const observer = new MutationObserver(updateMenuAudio);

        observer.observe(menu, {
            attributes: true,
            attributeFilter: ["hidden", "class", "style"]
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(fadeFrame);
                revision++;
                active = false;

                tracks.forEach(({ audio }) => {
                    audio.pause();
                    audio.volume = 0;
                });
            } else {
                updateMenuAudio();
            }
        });

        updateMenuAudio();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            setupMenuAudio,
            { once: true }
        );
    } else {
        setupMenuAudio();
    }
})();