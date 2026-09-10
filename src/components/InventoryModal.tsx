import React, { useState } from 'react';
import { X, Sparkles, Heart, Package, Shield } from 'lucide-react';
import { InventoryItem } from '../types';
import { sound } from '../game/sound';

interface InventoryModalProps {
  inventory: InventoryItem[];
  playerHp: number;
  maxHp: number;
  onClose: () => void;
  onUseItem: (item: InventoryItem) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  playerHp,
  maxHp,
  onClose,
  onUseItem,
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(
    inventory.length > 0 ? inventory[0] : null
  );

  const handleUse = (item: InventoryItem) => {
    sound.playUiClick();
    onUseItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none">
      <div className="pixel-box max-w-xl w-full p-5 text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-emerald-800">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm md:text-base font-pixel text-amber-400">
              TAS PETUALANG KIKO
            </h2>
          </div>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            className="p-1 text-emerald-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Left Grid of Slots, Right Item Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item Grid */}
          <div>
            <div className="text-[11px] font-pixel text-emerald-300 mb-2">
              JARAHAN TERKUMPUL ({inventory.length} / 12)
            </div>

            <div className="grid grid-cols-4 gap-2 bg-black/50 p-2.5 border-2 border-emerald-900 rounded">
              {inventory.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playUiClick();
                      setSelectedItem(item);
                    }}
                    className={`relative w-14 h-14 pixel-box-dark flex flex-col items-center justify-center transition-transform cursor-pointer ${
                      isSelected ? 'border-amber-400 bg-amber-950/40 scale-105' : 'hover:border-emerald-500'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-[10px] font-pixel text-amber-300 rounded">
                      {item.count}
                    </span>
                  </button>
                );
              })}

              {/* Empty Slots */}
              {Array.from({ length: Math.max(0, 12 - inventory.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-14 h-14 border border-dashed border-emerald-900/60 rounded bg-black/20 flex items-center justify-center text-emerald-800/40 text-xs font-pixel"
                >
                  -
                </div>
              ))}
            </div>
          </div>

          {/* Item Details Panel */}
          <div className="pixel-box-dark p-3.5 flex flex-col justify-between border-2 border-emerald-800">
            {selectedItem ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-emerald-950 border-2 border-emerald-600 rounded flex items-center justify-center text-3xl">
                      {selectedItem.icon}
                    </div>
                    <div>
                      <div className="text-xs font-pixel text-amber-300">
                        {selectedItem.name}
                      </div>
                      <div className="text-[10px] font-pixel text-emerald-400">
                        Jumlah: x{selectedItem.count}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-silkscreen text-emerald-100/90 leading-relaxed mb-4 bg-black/40 p-2.5 border border-emerald-900/80 rounded">
                    {selectedItem.description}
                  </p>

                  {selectedItem.healAmount && (
                    <div className="flex items-center gap-1.5 text-xs font-pixel text-green-400 mb-2">
                      <Heart className="w-4 h-4 fill-current" />
                      Memulihkan +{selectedItem.healAmount} HP
                    </div>
                  )}
                </div>

                {/* Use Button */}
                {selectedItem.healAmount ? (
                  <button
                    onClick={() => handleUse(selectedItem)}
                    disabled={playerHp >= maxHp}
                    className={`w-full py-2.5 text-xs font-pixel tracking-wider ${
                      playerHp >= maxHp
                        ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                        : 'pixel-btn-amber cursor-pointer'
                    }`}
                  >
                    {playerHp >= maxHp ? 'HP SUDAH PENUH' : 'GUNAKAN SEKARANG'}
                  </button>
                ) : (
                  <div className="text-center py-2 text-[10px] font-silkscreen text-emerald-400/70 border border-emerald-900/60 rounded">
                    Item Koleksi / Harta Karun
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-silkscreen text-emerald-500">
                Pilih salah satu item di tas untuk melihat rincian.
              </div>
            )}
          </div>
        </div>

        {/* Footer Hint */}
        <div className="mt-4 pt-2 border-t border-emerald-900/60 flex justify-between items-center text-[10px] font-silkscreen text-emerald-400/80">
          <span>Tekan [I] atau [ESC] untuk menutup tas</span>
          <button
            onClick={() => {
              sound.playUiClick();
              onClose();
            }}
            className="pixel-btn px-4 py-1.5 text-[10px] font-pixel cursor-pointer"
          >
            TUTUP TAS
          </button>
        </div>
      </div>
    </div>
  );
};
