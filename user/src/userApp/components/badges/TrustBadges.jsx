import { MessageCircle, RotateCcw, Shield } from "lucide-react";

export const TrustBadges = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <MessageCircle className="w-5 h-5 text-green-600" />
      <div>
        <p className="font-medium">Delivery confirmation</p>
        <p className="text-xs">Via WhatsApp</p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <RotateCcw className="w-5 h-5 text-blue-600" />
      <div>
        <p className="font-medium">Easy Returns</p>
        <p className="text-xs">7 Days Return Policy</p>
      </div>
    </div>
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <Shield className="w-5 h-5 text-purple-600" />
      <div>
        <p className="font-medium">Secure Payment</p>
        <p className="text-xs">100% Secure</p>
      </div>
    </div>
  </div>
);
