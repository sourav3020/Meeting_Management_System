import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import FirstPDFFile from "./PDF/FirstPDFFile";

const FirstPDFViewerPage = () => {
  const { meetingId } = useParams();

  return (
    <div>
      <PDFViewer style={{ width: "100vw", height: "100vh" }}>
        <FirstPDFFile meetingID={meetingId} />
      </PDFViewer>
    </div>
  );
};

export default FirstPDFViewerPage;
