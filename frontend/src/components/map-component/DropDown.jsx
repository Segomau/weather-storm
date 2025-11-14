// Dropdown.jsx
import "./dropdown.css";

export default function Dropdown() {
    return (
        <div className="map-dropdown relative">
            <input type="checkbox" id="mapDropdown" className="dropdown-toggle" />

            {/* Botón */}
            <label
                htmlFor="mapDropdown"
                className="
                    dropdown-face
                    absolute bottom-4 left-4 z-50
                "
            >
                <span className="dropdown-text">Map Information</span>
                <span className="dropdown-arrow"></span>
            </label>

            {/* Panel */}
            <div
                className="
                    dropdown-panel
                    absolute bottom-16 left-4 z-40
                "
            >
                <div className="glass-box">
                    {/* Color Section */}
                    <h3 className="section-title">Color Gradient Scale</h3>

                    <ul className="color-list">
                        <li><span className="bar bar-none" /> No rain</li>
                        <li><span className="bar bar-low" /> Low intensity</li>
                        <li><span className="bar bar-mid" /> Moderate intensity</li>
                        <li><span className="bar bar-high" /> High intensity</li>
                        <li><span className="bar bar-vhigh" /> Very high intensity</li>
                        <li><span className="bar bar-extreme" /> Extreme intensity</li>
                    </ul>

                    {/* Description */}
                    <h3 className="section-title mt-4">Overview</h3>
                    <p className="description text-white/90 text-sm leading-relaxed">
                        This visualization represents real-time precipitation intensity.
                        Violet tones indicate low levels, transitioning into orange and red
                        as intensity increases.
                    </p>
                </div>
            </div>
        </div>
    );
}
