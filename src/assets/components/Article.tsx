import { motion } from "framer-motion";

type Props = {
  Articletitle?: string;
  Articledescription?: string;
  index?: number;
};

function Article({ Articletitle, Articledescription, index = 0 }: Props) {
  return (
    <motion.div
      className="Article"
      key={index}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.2,
        delay: index * 0.1,
      }}
    >
      <h1 className="ArticleTitle">{Articletitle}</h1>
      <p className="ArticleDescription">{Articledescription}</p>
    </motion.div>
  );
}

export default Article;
