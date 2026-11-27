import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

type OptionContainerProp = {
  OptionMap: {
    name: string;
    action: () => void;
    type: string;
  }[];
};

function OptionContainer({ OptionMap }: OptionContainerProp) {
  const [clicked, setClicked] = useState<string | null>(null);
  const [tap, setTap] = useState(0);

  function handleClick(option: { name: string }) {
    setClicked(option.name);
    setTap((t) => t + 1);
    setTimeout(() => setClicked(null), 1000);
  }

  return (
    <>
      <div className="OptionContainer">
        {OptionMap.map((option, key) => (
          <button
            className={"option"}
            onClick={() => {
              handleClick({ name: option.name });
              option.action();
            }}
            key={key}
          >
            {option.name}
            <IoIosArrowForward
              key={tap}
              className={clicked === option.name ? "clicked" : ""}
            />
          </button>
        ))}
      </div>
    </>
  );
}

export default OptionContainer;
