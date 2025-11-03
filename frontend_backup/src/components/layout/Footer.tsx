const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4 dark:bg-gray-900 dark:text-gray-400">
      © {new Date().getFullYear()} daclong. All rights reserved.
    </footer>
  );
};

export default Footer;
