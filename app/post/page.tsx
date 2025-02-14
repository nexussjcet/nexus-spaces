import Navbar from "@/components/custom/navbar";
import TextEditor from "@/components/custom/text-editor";

export default function PostPage() {
  return (
    <div className="fixed inset-0 bg-black text-white overflow-y-auto">
      <Navbar />
      <TextEditor />
    </div>
  );
}
