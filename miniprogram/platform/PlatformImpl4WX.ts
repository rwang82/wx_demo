namespace MGRPT {
    export class PlatformImpl4WX implements IPlatform {

        // parseCroProTag(): string {
        //     let croproTag = undefined;
        //     let options: LaunchOption = this.getLaunchParameter();
        //     if (options.referrerInfo && options.referrerInfo.appId) {
        //         let extraData = options.referrerInfo.extraData;
        //         if (extraData && extraData.hasOwnProperty(MGCroProTag.KEY_CROSS_PROMOTION_TAG)) {
        //             croproTag = extraData[MGCroProTag.KEY_CROSS_PROMOTION_TAG];
        //             Log.i("MGRPT_DEBUG", "cross promotion tag parsed: " + croproTag);
        //         }
        //     }
        //     return croproTag;
        // }

        // public fillShareTag(tag: MGShareTag): void {
        //     if (!tag) {
        //         return;
        //     }
        //     let paramLaunch = wx.getLaunchOptionsSync();
        //     if (!paramLaunch || !paramLaunch.query) {
        //         return;
        //     }
        //     if (paramLaunch.query.hasOwnProperty(MGShareTag.KEY_LEVEL)) {
        //         Log.i("MGRPT_DEBUG", "pl_level:" + paramLaunch.query.agent_level);
                
        //         tag.setLevel(Number(paramLaunch.query.agent_level) + 1);
        //     }
        //     if (paramLaunch.query.hasOwnProperty(MGShareTag.KEY_SUPER)) {
        //         Log.i("MGRPT_DEBUG", "pl_super:" + paramLaunch.query.agent_upper);
        //         tag.setSuper(paramLaunch.query.agent_upper);
        //     }
        //     if (paramLaunch.query.hasOwnProperty(MGShareTag.KEY_ORIGIN)) {
        //         Log.i("MGRPT_DEBUG", "pl_origin:" + paramLaunch.query.agent_orign);
        //         tag.setOrigin(paramLaunch.query.agent_orign);
        //     }
        // }

        // fillInfocEnvCfg(infocEnvCfg: InfocEnvCfgData): InfocEnvCfgData {
        //     if (infocEnvCfg) {
        //         if (!infocEnvCfg.channelKey) {
        //             // 填充游戏平台参数
        //             infocEnvCfg.channelKey = 1;
        //         }
        //         if (!infocEnvCfg.sub_channel) {
        //             // 填充游戏子渠道参数
        //             infocEnvCfg.sub_channel = SubChannelHelper.getSubChannel(this.getLaunchParameter());
        //         }
        //     }
        //     return infocEnvCfg;
        // }

        // private getLaunchParameter(): LaunchOption {
        //     return wx.getLaunchOptionsSync();
        // }

        public login(param: {
            success: (code) => void,
            fail?: () => void
        }) {
            wx.login({
                success: res => {
                    Log.i("WX login success. # code:" + res.code);
                },
                fail: res => {
                    Log.i("WX login failed. # code:" + res.code + ", errmsg:" + res.errMsg);
                }
            });
        }

        public getUserSetting(param: {
            success: (authSetting: any) => void,
            fail?: () => void,
        }): void {
            wx.getSetting({
                success: (res) => {
                    if (param.success) param.success(res.authSetting);
                },
                fail: () => {
                    if (param.fail) param.fail();
                }
            });
        }

        public request(param: {
            url: string,
            data?: string | Object,
            header?: Object,
            method?: string,
            dataType?: string,
            success?: (code: number, data: any, header: any) => void,
            fail?: (code: number, data: any) => void
        }, retryCount: number) {
            wx.request({
                url: param.url,
                data: param.data,
                header: param.header,
                method: param.method,
                dataType: param.dataType,
                success: res => {
                    if (res.statusCode != 200) {
                        if (param.fail) {
                            param.fail(res.statusCode, res);
                        }
                    } else if (res.data) {
                        if (param.success) {
                            param.success(res.statusCode, res.data, res.header);
                        }
                    } else {
                        if (param.fail) {
                            param.fail(res.statusCode, res);
                        }
                    }
                },
                fail: () => {
                    if (retryCount > 1) {
                        this.request(param, retryCount - 1)
                    }
                    else {
                        if (param.fail) {
                            param.fail(-1, null);
                        }
                    }
                }
            });
        }

        // public getPlatformInfo(): PlatformInfo {
        //     return wx.getSystemInfoSync();
        // }

        public setStorage(key: string, value: string): void {
            wx.setStorageSync(key, value);
        }
        
        public getStorage(key: string): string {
            return wx.getStorageSync(key);
        }
        
        public delStorage(key: string): void {
            wx.removeStorageSync(key);
        }
    }
}