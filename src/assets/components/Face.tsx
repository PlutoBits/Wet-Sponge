import { useState } from "react";

type NotFoundItemProm = {
  width?: number;
  heigth?: number;
  classis?: string;
  padding?: number;
  text?: string;
  type?: string;
};

function Face({
  width = 100,
  heigth = 100,
  classis,
  padding,
  text,
  type,
}: NotFoundItemProm) {
  const [typeState] = useState(type);
  if (typeState == "sad") {
    return (
      <>
        <div
          className={`${classis} Face`}
          style={{
            width: `${width}px`,
            height: `${heigth}px`,
            padding: `0 ${padding}px`,
          }}
        >
          <span className="eyeRow">
            <div className="leftEye">
              <i className="fa-solid fa-x" />
            </div>
            <div className="rightEye">
              <i className="fa-solid fa-x" />
            </div>
          </span>
          <span className="Mouth">{"("}</span>
          {text ? <div className="text handing">{text}</div> : null}
        </div>
      </>
    );
  } else if (typeState == "happy") {
    return (
      <>
        <div
          className={`${classis} Face`}
          style={{
            width: `${width}px`,
            height: `${heigth}px`,
            padding: `0 ${padding}px`,
          }}
        >
          <span className="eyeRow">
            <div className="leftEye">
              <div className="eye">{"("}</div>
            </div>
            <div className="rightEye">
              <div className="eye">{"("}</div>
            </div>
          </span>
          <span className="Mouth">{")"}</span>
          {text ? <div className="text handing">{text}</div> : null}
        </div>
      </>
    );
  }
}

export default Face;
