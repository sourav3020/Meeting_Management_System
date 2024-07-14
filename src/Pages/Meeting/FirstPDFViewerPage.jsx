import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import FirstPDFFile from './PDF/FirstPDFFile';

const FirstPDFViewerPage = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  // const handleBack = () => {
  //   navigate('/main/sendinvitation');
  // };

  return (
    <div>
      {/* <button onClick={handleBack} className="mt-1 mr-4 bg-slate-700 text-white p-2">
        Back
      </button> */}
      <PDFViewer style={{ width: '100vw', height: '100vh' }}>
        <FirstPDFFile meetingID={meetingId} />
      </PDFViewer>
    </div>
  );
};

export default FirstPDFViewerPage;
