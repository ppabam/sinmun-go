// components/FAQList.tsx
import React from 'react';
import { FAQ } from '@/app/types/faq';

interface FAQListProps {
  faqs: FAQ[];
}

const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  return (
    <ul className="space-y-4">
      {faqs.map((faq) => (
        <li key={faq.faqNo} className="border p-4 rounded">
          <h2 className="text-xl font-semibold">{faq.qnaTitl}</h2>
          <p className="text-gray-600">{faq.qstnCntnCl}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">답변 보기</summary>
            <div dangerouslySetInnerHTML={{ __html: faq.ansCntnCl }} className="mt-1" />
          </details>
          <p className="text-sm text-gray-400 mt-2">
            등록일: {faq.regDate} / 부서: {faq.deptName}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default FAQList;