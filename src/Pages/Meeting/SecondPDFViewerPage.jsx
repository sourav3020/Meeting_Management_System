import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import SecondPDFFile from './PDF/SecondPDFFile';

const SecondPDFViewerPage = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();

  return (
    <div>
      {/* <button onClick={handleBack} class="mt-1 mr-4 bg-slate-700 text-white p-2">Back</button> */}
      <PDFViewer style={{ width: '100vw', height: '100vh' }}>
        <SecondPDFFile meetingID={meetingId} />
      </PDFViewer>
    </div>
  );
};

export default SecondPDFViewerPage;
