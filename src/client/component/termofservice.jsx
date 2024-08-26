"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export function TermOfService() {
  const [openModal, setOpenModal] = useState(true);

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-start">
              TOP Bk
              เป็นเว็บไซต์สำหรับคนรักภาพยนตร์ที่ต้องการประสบการณ์การชมภาพยนตร์ที่ดีที่สุด
              ไม่ว่าคุณจะชอบดูหนังในโรงภาพยนตร์หรือดูออนไลน์ TOP Bk
              มีทุกอย่างให้คุณได้เพลิดเพลิน
              ด้วยคุณสมบัติที่ทันสมัยและการให้บริการที่ยอดเยี่ยมstart
              คุณจะไม่พลาดทุกเรื่องโปรดและทุกเหตุการณ์สำคัญในวงการภาพยนตร์
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-start">
              TOP BK มีระบบจองตั๋วออนไลน์
              ซึ่งออกแบบมาเพื่อความสะดวกและรวดเร็วในการซื้อตั๋วหนังสำหรับผู้ชมทุกคน
              โดยระบบนี้จะทำให้ผู้ใช้สามารถเลือกที่นั่ง
              จองตั๋วและชำระเงินผ่านช่องทาง
              ออนไลน์ได้อย่างง่ายดายทั้งนี้เพื่อให้ผู้ชมสามารถเข้าถึงการจองตั๋วได้อย่างรวดเร็ว
              และไม่ต้องรอคิวยาวที่หน้าโรงภาพยนตร์อีกต่อไปโรงภาพยนตร์ TOP BK
              ให้ความสำคัญกับการให้บริการที่ดีที่สุดและทันสมัยที่สุดแก่ผู้ชมทุกคน
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
