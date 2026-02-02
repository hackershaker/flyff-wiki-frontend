import { Camera } from "lucide-react";
import ToolbarButton from "../components/ToolbarButton";

export default function EditorTestPage() {
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <Camera color="red" size={48} />
      <ToolbarButton icon='bold' />
    </div>
  );
}
