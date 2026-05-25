# Apex Reach // by Robi3 Robotics

Apex Reach is a premium, high-performance web application designed to measure and track an athlete's vertical jump reach, standing reach, and total vertical leap in real time using a standard webcam. 

This program was engineered to solve an urgent hardware breakdown for the [Robi3 Robotics High-Jump Game](https://www.instagram.com/p/DYrVi6wiOe9/), which originally operated using physical infra-red light sensors. By leveraging computer vision, we replaced failing physical infrastructure with a robust, zero-cost camera tracking algorithm.

🔗 **Live Deployment**: **[https://robi3-robotics.github.io/interactive.motiongame.highjump/](https://robi3-robotics.github.io/interactive.motiongame.highjump/)**

---

## Key Features

*   **⚡ Manual 3-Line Calibration Console**: Align three color-coded canvas guides ($1.0\text{m}$, $1.5\text{m}$, and $2.0\text{m}$) directly over real-world physical references on your wall. Once locked, the system calculates real-world pixel ratios and floor levels instantly.
*   **🎯 Player Focus (Region of Interest)**: Crop and focus the camera sensors exclusively on the athlete. This ignores background movement, speeds up coordinate calculations, and keeps tracking stable in busy public environments.
*   **🔊 Integrated retro-synth audio**: Programmed entirely using the browser's native **Web Audio API** (Oscillators/Gain Nodes). The app synthesizes countdown ticks, takeoff swooshes, peak bubble-pings, and record-breaking cascading fanfares on the fly with **zero external asset files**.
*   **🥇 Session Leaderboard & Log**: Tracks jump counts, peak fingertip reach metrics, and session records, compiling them into a responsive log. Best scores are automatically cached in local browser storage (`localStorage`).
*   **🛡️ Complete Local Privacy**: 100% of the video processing is done client-side inside the browser. No video frames, coordinates, or user data are sent to external servers.

---

## Technical Architecture & Math

### 1. Manual Height Scaling
By dragging the $2.0\text{m}$ line ($y_{2m}$) and $1.0\text{m}$ line ($y_{1m}$) on screen, the physical distance between them is exactly $100\text{ cm}$. We calculate the real-world scale factor ($SF$) in pixels per centimeter:
$$SF = \frac{y_{1m} - y_{2m}}{100}$$

The floor level ($0.0\text{m}$ base line, $y_{floor}$) is then determined automatically:
$$y_{floor} = y_{1m} + (y_{1m} - y_{2m}) \times 1.0$$

### 2. ROI Coordinate Reverse-Mapping
When Focus Mode is active, normalized sub-frame coordinates ($x_{crop}, y_{crop}$) are translated back to full-screen canvas space ($x_{full}, y_{full}$) using the crop box specifications ($roi$):
$$x_{full} = roi.x + x_{crop} \times roi.width$$
$$y_{full} = roi.y + y_{crop} \times roi.height$$

---

## How to Run Locally

Because the application utilizes ES6 JavaScript Modules (`type="module"`), modern browsers block loading them directly via the `file://` protocol. You must serve the folder using a local HTTP server.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Robi3-Robotics/interactive.motiongame.highjump.git
    cd interactive.motiongame.highjump
    ```
2.  **Start a Static Server**:
    *   Using **Node.js**:
        ```bash
        npx http-server -p 8080
        ```
    *   Using **Python**:
        ```bash
        python -m http.server 8080
        ```
3.  **Open in Browser**:
    Navigate to `http://localhost:8080` in your web browser.

> [!WARNING]
> **Webcam Security Policy**: Web browsers restrict camera access (`navigator.mediaDevices.getUserMedia`) to secure contexts. When running locally, `http://localhost:8080` is permitted. When hosting in the cloud, **you must access the site via HTTPS (`https://`)**, otherwise the browser will block the webcam.

---

## Credits & License

*   **Concept & Hardware Origin**: Robi3 Robotics High-Jump Game. See the original infra-red sensor setup on [Instagram](https://www.instagram.com/p/DYrVi6wiOe9/).
*   **Development**: Built with **Antigravity AI Vibe-Coding** (Google DeepMind Team).
*   **Usage**: Currently open to all for **non-commercial purposes**. 

📩 *As a courtesy, please inform **judy@j4dy.net** if you are using this code for your own project!*
