import { Button } from "../../../@/components/ui/button";
import { Textarea } from "../../../@/components/ui/textarea";

function Cafe() {
  return (
    <>
      <div className="intro">
        <div className="handing">CAFE</div>
        <div className="title">
          Fan art, theories, chapter talk, and studio chatter.
        </div>
        <div className="aboutwebsite">
          Create posts and react to the Wet Sponge signal.
        </div>
        <div className="postArea">
          <form>
            <Textarea
              placeholder="Share a theory, fan art note, or chapter reaction..."
              className="TextArea"
            ></Textarea>
            <Button className={"TextAreaPostbtn"}>Post</Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Cafe;
