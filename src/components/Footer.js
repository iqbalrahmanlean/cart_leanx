// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-cyan-800 p-10 text-neutral-200 mt-20">
      <div className="flex w-full max-w-7xl mx-auto flex-col justify-center gap-10">
        <div>
          <h4 className="mb-3 text-[18px] font-bold">お問い合わせ</h4>
          <div className="flex flex-col gap-2 text-body2 text-neutral-400">
            <strong className="text-body1 text-white">Twopip Research Japan Office</strong>
            <p>
              <strong>電子メール</strong> : 
              <a href="mailto:support@twopip.com" className="hover:text-white transition-colors">support@twopip.com</a>
            </p>
            <p>
              <strong>時間</strong> : M-Th 9:00am - 5:00pm JST; F 9:00am - 5:30pm JST
            </p>
            <p>
              <strong>住所</strong> : 
              五反田サンハイツビル2F 西五反田1-26-2 品川区 東京、日本 141-0031
            </p>
            <p>
              <strong>代表者名</strong> : 
              Gilbert Lee
            </p>
            <a className="text-white underline hover:text-neutral-200 transition-colors" href="/jp-JP/specified-commercial-transactions">
              特定商取引法に基づく表記
            </a>
          </div>
        </div>
        <div>
          <a className="text-body2 text-neutral-400 underline hover:text-white transition-colors" href="/jp-JP/privacy-policy">
            プライバシーポリシー
          </a>
          <a className="ml-3 text-body2 text-neutral-400 underline hover:text-white transition-colors" href="/jp-JP/terms-conditions">
            利用規約
          </a>
          <p className="mt-1 text-neutral-400">
            Copyright © Twopip. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;