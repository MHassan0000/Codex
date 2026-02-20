import { HexColorInput, HexColorPicker } from "react-colorful";

interface Props {
    value?: string;
    onPickerChange: (color: string) => void;
}

const ColorPicker = ({ value, onPickerChange }: Props) => {
    return (
        <div className="color-picker-wrapper">
            <HexColorPicker color={value} onChange={onPickerChange} />
            <div className="color-picker-input-row">
                <div
                    className="color-picker-swatch"
                    style={{ backgroundColor: value || "#000000" }}
                />
                <span className="color-picker-hash">#</span>
                <HexColorInput
                    color={value}
                    onChange={onPickerChange}
                    className="hex-input"
                />
            </div>
        </div>
    );
};

export default ColorPicker;