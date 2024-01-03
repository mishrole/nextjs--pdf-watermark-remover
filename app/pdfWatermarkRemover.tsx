"use client"

import React, { useState } from "react"
import Image from "next/image"
import axios from "axios"

import SpinnerLoader from "./components/SpinnerLoader"
import PdfViewer from "./containers/PdfViewer"

const PdfWatermarkRemover = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfImages, setPdfImages] = useState<any>(null)
  const [pdfBuffer, setPdfBuffer] = useState<Buffer | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [newPdfFile, setNewPdfFile] = useState<Buffer | null>(null)
  const [showViewer, setShowViewer] = useState<boolean>(false)

  const API_WATERMARK_ENDPOINT = "/api/watermark"

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null

    if (!selectedFile) {
      alert("No se ha seleccionado ningún archivo válido")
    } else {
      setPdfFile(selectedFile)
    }
  }

  const processPDF = async () => {
    setNewPdfFile(null)
    setShowViewer(false)
    setPdfImages(null)

    if (pdfFile) {
      setLoading(true)
      const fileReader = new FileReader()

      fileReader.onload = async function () {
        const buffer = Buffer.from(this.result as ArrayBuffer)

        setPdfBuffer(buffer)

        try {
          const response = await axios.post(
            `${API_WATERMARK_ENDPOINT}/listv2`,
            {
              pdfBuffer: buffer,
            }
          )

          console.log("PDF procesado:", response.data)

          setPdfImages(response.data)
        } catch (error: any) {
          console.error("Error al procesar el PDF:", error.response)
        } finally {
          setLoading(false)
        }
      }

      fileReader.readAsArrayBuffer(pdfFile)
    }
  }

  const deleteImage = async (imageRef: number) => {
    // TODO: Support multiple images deletion at once
    if (pdfFile && pdfBuffer) {
      // setPdfImages(null);
      setLoading(true)

      try {
        const response = await axios.post(
          `${API_WATERMARK_ENDPOINT}/remove?imageRef=${imageRef}`,
          {
            pdfBuffer: pdfBuffer,
          },
          {
            // ! This is needed in order to display the PDF using react-pdf library without errors
            // ! Avoid the error "FormatError: Bad FCHECK in flate stream: 120, 239" when rendering the PDF
            responseType: "blob", // Esperar una respuesta de tipo Blob
          }
        )

        if (response.data) {
          setNewPdfFile(response.data)
          setShowViewer(true)

          // TODO: When an image is deleted, the resulting PDF needs to replace the original one in order to send it to the server again and delete another image
          // pdfImages.images = pdfImages.images.filter(
          //   (image: any) => image.ref !== imageRef
          // );
        }
      } catch (error: any) {
        console.error("Error al eliminar la imagen:", error.response)
        setShowViewer(false)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <div className="pdf__form__wrapper">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          placeholder="File"
        />

        <button type="button" onClick={processPDF}>
          Procesar PDF
        </button>
      </div>

      <div className="pdf__result__wrapper">
        <div>
          {pdfFile && !showViewer ? (
            <PdfViewer title={"Original"} pdfBuffer={pdfBuffer} />
          ) : null}

          {newPdfFile && showViewer ? (
            <PdfViewer title={"Result"} pdfBuffer={newPdfFile} />
          ) : null}
        </div>

        {pdfFile && (
          <div>
            {loading && <SpinnerLoader />}

            {pdfImages && (
              <div className="pdf__gallery">
                {pdfImages.images.map((info: any) => {
                  const {
                    fileName,
                    data,
                    kindType,
                    ref,
                    type,
                    needsAlphaLayer,
                  } = info
                  return (
                    <div className="pdf__card" key={`${fileName ?? ref}${""}`}>
                      <div className="pdf__card__body">
                        <Image
                          className="pdf__card__body__image"
                          src={`data:image/${type};base64,${data}`}
                          width="200"
                          height="200"
                          alt={`${fileName ?? ref}${" "}`}
                        />
                      </div>

                      <div className="pdf__card__footer">
                        <span>
                          {fileName ?? ref}{" "}
                          <b>
                            ({kindType} {type} {needsAlphaLayer ? "Alpha " : ""}
                            )
                          </b>
                        </span>
                      </div>

                      <div className="pdf__card__floating__cta">
                        {/* Delete */}
                        <button
                          className="pdf__card__floating__cta__delete"
                          type="button"
                          onClick={() => {
                            deleteImage(ref)
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PdfWatermarkRemover
