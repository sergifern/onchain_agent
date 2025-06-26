import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export const ChatOverview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:!mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <div className="flex flex-col justify-center gap-4 items-center">
          <h1 className="flex flex-row justify-center gap-4 items-center font-semibold text-2xl">
            Welcome to Ethy AI
          </h1>
        </div>

        <p className="hidden">
          Unlock ecommerce with AI. Ask anything about your store, products, customers, and more.
        </p>
         
        <p className="hidden">
          You can learn more about Ethy AI by visiting the{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://docs.ethyai.app"
            target="_blank"
          >
            docs
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
