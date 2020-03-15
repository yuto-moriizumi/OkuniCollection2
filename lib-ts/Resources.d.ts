declare const Resource: Readonly<{
    Static: {
        Title: {
            Bg: string;
        };
        Magic: string;
        BattleBgFores: string[];
        BattleBgMiddles: string[];
        BattleBgBacks: string[];
        Audio: {
            Bgm: {
                Title: string;
                CombineScene: string;
            };
            SE: {
                onCircle: string;
                onCombine: string;
            };
        };
    };
    FontFamily: {
        Default: string;
    };
}>;
export default Resource;
