import { Easing as Ease } from 'react-native';

export const Easing = {
    Standard     : Ease.bezier(0.4, 0.0, 0.2, 1),
    Deceleration : Ease.bezier(0.0, 0.0, 0.2, 1),
    Acceleration : Ease.bezier(0.4, 0.0, 1, 1),
    Sharp        : Ease.bezier(0.4, 0.0, 0.6, 1)
};