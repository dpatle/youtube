import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import plusIcon from "../static/plus.svg";
import deleteIcon from "../static/delete.svg";

const ClipForm = ({ index, total, detail = {}, onNext, onPrev, onFinish }) => {
  const [title, setTitle] = useState(detail.title);
  const [clipData, setClipData] = useState(detail.clipData);
  const [hasBorder, setHasBorder] = useState(!!detail.hasBorder);

  const [labels, setLabels] = useState(
    detail.labels ?? [{ name: "", time: "", type: "name" }]
  );
  const isValid = clipData !== undefined;
  const showAddLabel = labels.every((s) => s.name.trim() && s.time.trim());

  const handleLineChange = (line = {}, index) => {
    setLabels((prev) => {
      const curr = [...prev];
      curr[index] = { ...curr[index], ...line };
      return [...curr];
    });
  };
  const handleTimeChange = (time = "", index) => {
    setLabels((prev) => {
      const curr = [...prev];
      curr[index] = { ...curr[index], time };
      return [...curr];
    });
  };
  const handleTypeChange = (type = "name", index) => {
    setLabels((prev) => {
      const curr = [...prev];
      curr[index] = { ...curr[index], type };
      return [...curr];
    });
  };

  return (
    <>
      <Card style={{ width: "100%", maxWidth: "768px" }} className="container">
        <Card.Body style={{ textAlign: "left" }}>
          <Card.Title>
            Clip: {index + 1} / {total}
          </Card.Title>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>
                Clip Title (To be appear at start of Clip)
              </Form.Label>
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="Video Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Form.Label>Set border to video:</Form.Label>
              <div className="mb-3">
                <Form.Check
                  inline
                  label="Set Border"
                  name="hasBorder"
                  type="checkbox"
                  id="hasBorder"
                  defaultChecked={hasBorder}
                  onChange={(e) => setHasBorder(!!e.target.checked)}
                />
              </div>
              <Form.Label>Clip Labels</Form.Label>

              {labels.map((s, i) => (
                <div className="mb-2 p-2" style={{ border: "1px solid #aaa" }}>
                  <div className="d-flex" style={{ gap: "10px" }}>
                    <Form.Control
                      className="mb-1 w-50"
                      type="number"
                      placeholder="Start time in seconds"
                      value={s.time}
                      onChange={(e) => handleTimeChange(e.target.value, i)}
                    />
                    <div key={`inline-radio`} className="mb-3">
                      <Form.Check
                        inline
                        label="Name"
                        name={`label-type-${i}`}
                        type="radio"
                        id="name"
                        defaultChecked={s.type === "name"}
                        onChange={(e) =>
                          e.target.checked && handleTypeChange("name", i)
                        }
                      />
                      <Form.Check
                        inline
                        label="Courtesy"
                        name={`label-type-${i}`}
                        type="radio"
                        id="courtesy"
                        defaultChecked={s.type === "courtesy"}
                        onChange={(e) =>
                          e.target.checked && handleTypeChange("courtesy", i)
                        }
                      />
                      <Form.Check
                        inline
                        label="Place"
                        name={`label-type-${i}`}
                        type="radio"
                        id="place"
                        defaultChecked={s.type === "place"}
                        onChange={(e) =>
                          e.target.checked && handleTypeChange("place", i)
                        }
                      />
                    </div>
                  </div>
                  <Form.Control
                    className="mb-1"
                    type="text"
                    placeholder="Label here, use slash for multi line"
                    value={s.name}
                    onChange={(e) =>
                      handleLineChange({ name: e.target.value }, i)
                    }
                  />
                  <Button
                    variant="primary"
                    onClick={() =>
                      setLabels((prev) => {
                        const temp = [...prev].splice(i, 1);
                        return [...temp];
                      })
                    }
                  >
                    <img src={deleteIcon} style={{ width: "20px" }} />
                  </Button>{" "}
                </div>
              ))}
              <Button
                disabled={!showAddLabel}
                variant="primary"
                className="mb-3"
                onClick={() =>
                  setLabels((prev) => [
                    ...prev,
                    { name: "", time: "", type: "name" },
                  ])
                }
              >
                <img src={plusIcon} style={{ width: "20px" }} />
                <span className="ms-2">Add Another Label</span>
              </Button>
              <br></br>
              {clipData !== undefined && (
                <Form.Text>Uploaded Video: &nbsp;{clipData.name}</Form.Text>
              )}
              {clipData === undefined && (
                <>
                  <Form.Label>Upload Clip</Form.Label>
                  <Form.Control
                    type="file"
                    className="mb-3"
                    accept="video/*"
                    onChange={(e) => setClipData(e.target.files[0])}
                  />
                </>
              )}
            </Form.Group>
          </Form>
          <Button
            disabled={index === 0}
            className="me-2"
            variant="primary"
            onClick={() => onPrev({ ...detail, title, clipData, labels, hasBorder })}
          >
            Prev
          </Button>
          <Button
            disabled={!isValid}
            className="me-2"
            variant="primary"
            onClick={() => onNext({ ...detail, title, clipData, labels, hasBorder })}
          >
            Next
          </Button>
        </Card.Body>
      </Card>
      <Button
        disabled={!isValid}
        onClick={() => onFinish({ ...detail, title, clipData, labels, hasBorder })}
        variant="primary"
        className="my-2"
      >
        Create and Play Video
      </Button>
    </>
  );
};
export const Build = ({ onFormBuild, clips = [{}] }) => {
  const [videoDetail, setVideoDetail] = useState(clips);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const totalClips = videoDetail.length;
  const handleNext = (detail) => {
    setVideoDetail((prev) => {
      prev[currentClipIndex] = detail;
      if (videoDetail.length - 1 <= currentClipIndex) {
        prev.push([{}]);
      }
      return prev;
    });
    setCurrentClipIndex((prev) => prev + 1);
  };
  const handlePrev = (detail) => {
    setVideoDetail((prev) => {
      prev[currentClipIndex] = detail;
      return prev;
    });
    setCurrentClipIndex((prev) => prev - 1);
  };
  const onFinish = (detail) => {
    setVideoDetail((prev) => {
      prev[currentClipIndex] = detail;
      return prev;
    });
    onFormBuild(videoDetail);
  };
  return (
    <div className="my-2">
      {videoDetail.map((detail, index) => (
        <React.Fragment key={`detail-${index}`}>
          {index === currentClipIndex && (
            <ClipForm
              detail={detail}
              index={index}
              total={totalClips}
              onNext={handleNext}
              onPrev={handlePrev}
              onFinish={onFinish}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
