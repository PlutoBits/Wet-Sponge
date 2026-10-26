import { motion } from "framer-motion";

type Props = {
  image?: string;
  title?: string;
  index?: number;
};

function MusicCard({ image, title, index = 0 }: Props) {
  return (
    <motion.div
      className={`MusicCard`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.2,
        delay: index * 0.1,
      }}
    >
      <div className="MusicCardTop">
        {image && <img src={image} alt={title} className="cover" />}
      </div>
      <div className="MusicCardbottom">
        <h1 className="MusicCardtitle">{title}</h1>
      </div>
    </motion.div>
  );
}

export default MusicCard;
