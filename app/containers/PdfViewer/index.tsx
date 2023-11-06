import { Document, Page, pdfjs } from "react-pdf";

import React from "react";
import workerSrc from "../../../pdf-worker";
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const PdfViewer = ({ title, pdfBuffer }: any) => {
  const [pdfData, setPdfData] = React.useState<any>(null);
  const [numPages, setNumPages] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  React.useEffect(() => {
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    setPdfData(url);

    return () => {
      window.URL.revokeObjectURL(url);
    };
  }, [pdfBuffer]);

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1rem"
        }}
      >
        {title}
      </h1>
      {pdfData ? (
        <>
          <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
            {/* {Array.from(new Array(numPages), (_el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))} */}
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>

          <div className="flex justify-center">
            <button type="button" onClick={() => window.open(pdfData)}>
              Descargar
            </button>
          </div>

          {numPages > 1 ? (
            <div>
              <p>
                Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
              </p>
              <button
                type="button"
                disabled={pageNumber <= 1}
                onClick={previousPage}
              >
                Previous
              </button>
              <button
                type="button"
                disabled={pageNumber >= numPages}
                onClick={nextPage}
              >
                Next
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default PdfViewer;
