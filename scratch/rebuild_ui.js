const fs = require('fs');
let html = fs.readFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', 'utf8');

const newAuthView = `    <!-- Authentication View -->
    <div id="auth-view" class="flex-1 flex items-center justify-center p-4 min-h-screen relative z-10 bg-[#07595E]">
        
        <!-- Premium Auth Card matching the provided UI -->
        <div class="w-full max-w-sm p-8 bg-white rounded-[3rem] shadow-2xl relative z-10 flex flex-col items-center">
            
            <!-- Logo -->
            <div class="w-16 h-16 bg-gradient-to-b from-[#117C7F] to-[#074D51] rounded-2xl flex items-center justify-center shadow-md mb-6">
                <span class="text-white text-6xl leading-none font-sans mt-3">*</span>
            </div>
            
            <!-- Titles -->
            <h2 class="text-3xl font-bold text-black mb-3" id="auth-title">Sign In</h2>
            <p class="text-xs text-gray-500 text-center px-4 mb-8" id="auth-subtitle">To sign in to an account in the application,<br>enter your email and password</p>
            
            <!-- Form -->
            <form id="auth-form" class="w-full space-y-5">
                
                <!-- Email Field -->
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-800 ml-2">Email</label>
                    <input type="text" id="auth-name" required class="w-full bg-[#E5E5EA] shadow-inner rounded-full px-6 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#07595E]/50 transition-all">
                </div>
                
                <!-- Password Field -->
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-800 ml-2">Password</label>
                    <div class="relative">
                        <input type="password" id="auth-pass" required class="w-full bg-[#E5E5EA] shadow-inner rounded-full px-6 py-4 text-sm font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-[#07595E]/50 transition-all">
                        <button type="button" class="absolute inset-y-0 right-0 pr-5 flex items-center text-black hover:text-gray-700">
                            <i class="ph-bold ph-eye text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Forgot Password -->
                <div class="flex justify-end pt-1">
                    <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">Forgot password?</a>
                </div>
                
                <!-- Error Box -->
                <div id="auth-error-box" class="hidden w-full bg-red-100 border border-red-300 rounded-2xl p-3 text-center">
                    <span id="auth-error-text" class="text-xs font-bold text-red-600"></span>
                </div>

                <!-- Submit Button -->
                <button type="submit" id="auth-submit-btn" class="w-full bg-gradient-to-r from-[#0E6C71] to-[#043C40] hover:from-[#0B5C60] hover:to-[#032D30] text-white font-bold text-lg py-4 rounded-full shadow-xl shadow-[#07595E]/30 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3">
                    Sign In <i class="ph-bold ph-arrow-right text-xl"></i>
                </button>
            </form>
            
            <!-- Toggle Mode (Kept for functionality but styled minimally) -->
            <div class="mt-8 text-center w-full">
                <p class="text-xs text-gray-500 mb-2" id="auth-prompt-text">Don't have an account?</p>
                <button id="toggle-auth-mode" class="text-sm font-bold text-[#07595E] hover:underline">Create New Account</button>
            </div>
        </div>
    </div>`;

html = html.replace(/<div id="auth-view"[\s\S]*?<!-- Dashboard View -->/, newAuthView + '\n\n    <!-- Dashboard View -->');

fs.writeFileSync('c:/Users/HP/Pictures/Screenshots/displine/index.html', html);
